// ==============================================================================
// CARBONSCOUT INDIA — METHODOLOGY MATCHING ENGINE
// ==============================================================================

import { Fact } from '@/lib/db/schema';
import {
  MethodologyVersion,
  ApplicabilityCondition,
  ConditionEvaluationResult,
  MethodologyMatchingSummary,
} from './types';
import { MethodologyRegistry } from './registry';

export class MethodologyMatcher {
  /**
   * Evaluates project facts against a given methodology version.
   */
  public evaluateMethodology(
    methodology: MethodologyVersion,
    facts: Fact[],
    projectSector: string
  ): MethodologyMatchingSummary {
    const conditionsEvaluated: ConditionEvaluationResult[] = [];
    const missingDataGaps: string[] = [];
    const redFlags: string[] = [];

    // Helper map of fact types to facts
    const factsMap = new Map<string, Fact[]>();
    for (const f of facts) {
      const existing = factsMap.get(f.fact_type) || [];
      existing.push(f);
      factsMap.set(f.fact_type, existing);
    }

    for (const cond of methodology.applicabilityConditions) {
      const evalResult = this.evaluateCondition(cond, factsMap, projectSector);
      conditionsEvaluated.push(evalResult);

      if (evalResult.status === 'MISSING_DATA' && cond.isMandatory) {
        missingDataGaps.push(`${cond.label}: Required data missing`);
      } else if (evalResult.status === 'FAILED') {
        redFlags.push(`${cond.label}: Condition failed — ${evalResult.message}`);
      } else if (evalResult.status === 'CONTRADICTORY') {
        redFlags.push(`${cond.label}: Contradictory evidence detected`);
      }
    }

    const matchedCount = conditionsEvaluated.filter((c) => c.status === 'MET').length;
    const failedCount = conditionsEvaluated.filter((c) => c.status === 'FAILED').length;
    const mandatoryMissingCount = conditionsEvaluated.filter(
      (c) => c.status === 'MISSING_DATA' && methodology.applicabilityConditions.find((ac) => ac.id === c.conditionId)?.isMandatory
    ).length;
    const contradictoryCount = conditionsEvaluated.filter((c) => c.status === 'CONTRADICTORY').length;

    let status: 'MATCH' | 'POTENTIAL_MATCH' | 'MISMATCH' | 'INSUFFICIENT_INFORMATION';
    let summary: string;
    let confidenceScore = 0.5;

    if (failedCount > 0) {
      status = 'MISMATCH';
      summary = `Ineligible under ${methodology.code}: ${failedCount} mandatory applicability condition(s) failed.`;
      confidenceScore = 0.9;
    } else if (contradictoryCount > 0) {
      status = 'INSUFFICIENT_INFORMATION';
      summary = `Unable to determine eligibility: Contradictory facts detected for ${methodology.code}. Additional verification needed.`;
      confidenceScore = 0.3;
    } else if (mandatoryMissingCount > 1) {
      status = 'INSUFFICIENT_INFORMATION';
      summary = `Insufficient evidence for ${methodology.code}: ${mandatoryMissingCount} required applicability conditions lack data.`;
      confidenceScore = 0.4;
    } else if (mandatoryMissingCount === 1) {
      status = 'POTENTIAL_MATCH';
      summary = `Potential candidate for ${methodology.code}: ${matchedCount} conditions met, but 1 pending validation.`;
      confidenceScore = 0.75;
    } else {
      status = 'MATCH';
      summary = `Strong preliminary candidate for ${methodology.code}: All ${matchedCount} evaluated applicability conditions met.`;
      confidenceScore = 0.9;
    }

    return {
      methodology,
      methodologyCode: methodology.code,
      status,
      conditionsEvaluated,
      matchedCount,
      failedCount,
      missingCount: mandatoryMissingCount,
      contradictoryCount,
      confidenceScore,
      summary,
      missingDataGaps,
      redFlags,
    };
  }

  private evaluateCondition(
    cond: ApplicabilityCondition,
    factsMap: Map<string, Fact[]>,
    projectSector: string
  ): ConditionEvaluationResult {
    // 1. Sector Check
    if (cond.field.toUpperCase() === 'SECTOR') {
      const allowed = String(cond.expectedValue).split(',').map((s) => s.trim().toLowerCase());
      const isMet = allowed.some((s) => projectSector.toLowerCase().includes(s));
      return {
        conditionId: cond.id,
        field: cond.field,
        label: cond.label,
        status: isMet ? 'MET' : 'FAILED',
        actualValue: projectSector,
        expectedValue: cond.expectedValue,
        message: isMet ? 'Sector aligns with methodology scope' : cond.failureMessage,
      };
    }

    // 2. Find relevant facts (case-insensitive and alias-aware)
    let matchingFacts: Fact[] = [];
    const normalizedCondField = cond.field.toLowerCase().replace(/_/g, '');

    for (const [factType, factsList] of factsMap.entries()) {
      const normalizedFactType = factType.toLowerCase().replace(/_/g, '');
      if (
        normalizedFactType === normalizedCondField ||
        normalizedFactType.includes(normalizedCondField) ||
        normalizedCondField.includes(normalizedFactType) ||
        (cond.field.toLowerCase().includes('biomass') && (normalizedFactType.includes('biomass') || normalizedFactType.includes('husk') || normalizedFactType.includes('feedstock'))) ||
        (cond.field.toLowerCase().includes('grid') && normalizedFactType.includes('grid')) ||
        (cond.field.toLowerCase().includes('carbon') && (normalizedFactType.includes('carbon') || normalizedFactType.includes('project'))) ||
        (cond.field.toLowerCase().includes('cbg') && (normalizedFactType.includes('cbg') || normalizedFactType.includes('biogas')))
      ) {
        matchingFacts.push(...factsList);
      }
    }

    if (matchingFacts.length === 0) {
      if (!cond.isMandatory) {
        return {
          conditionId: cond.id,
          field: cond.field,
          label: cond.label,
          status: 'MET',
          expectedValue: cond.expectedValue,
          message: 'Optional condition not specified; default acceptable',
        };
      }
      return {
        conditionId: cond.id,
        field: cond.field,
        label: cond.label,
        status: 'MISSING_DATA',
        expectedValue: cond.expectedValue,
        message: 'No recorded fact found for this condition',
      };
    }

    // Check for contradictory facts (e.g. one says true and one says false)
    if (matchingFacts.length > 1) {
      const distinctValues = new Set(matchingFacts.map((f) => String(f.value_raw).trim().toLowerCase()));
      if (
        distinctValues.size > 1 &&
        (distinctValues.has('true') || distinctValues.has('yes')) &&
        (distinctValues.has('false') || distinctValues.has('no') || distinctValues.has('none'))
      ) {
        return {
          conditionId: cond.id,
          field: cond.field,
          label: cond.label,
          status: 'CONTRADICTORY',
          actualValue: matchingFacts.map((f) => f.value_raw).join(' vs '),
          expectedValue: cond.expectedValue,
          message: 'Contradictory records present in project facts',
        };
      }
    }

    const primaryFact = matchingFacts[0];
    const rawVal = primaryFact.value_raw;
    const numVal = primaryFact.value_numeric !== undefined ? primaryFact.value_numeric : parseFloat(String(rawVal));

    if (cond.operator === 'GREATER_THAN') {
      if (isNaN(numVal)) {
        return {
          conditionId: cond.id,
          field: cond.field,
          label: cond.label,
          status: 'MISSING_DATA',
          actualValue: rawVal,
          expectedValue: cond.expectedValue,
          message: 'Value is not numeric',
          evidenceReference: primaryFact.source_url,
        };
      }
      const isMet = numVal >= Number(cond.expectedValue);
      return {
        conditionId: cond.id,
        field: cond.field,
        label: cond.label,
        status: isMet ? 'MET' : 'FAILED',
        actualValue: `${numVal} ${cond.unit || ''}`,
        expectedValue: `>= ${cond.expectedValue} ${cond.unit || ''}`,
        message: isMet ? `Value (${numVal}) meets threshold (>= ${cond.expectedValue})` : cond.failureMessage,
        evidenceReference: primaryFact.source_url,
      };
    }

    if (cond.operator === 'LESS_THAN') {
      if (isNaN(numVal)) {
        return {
          conditionId: cond.id,
          field: cond.field,
          label: cond.label,
          status: 'MISSING_DATA',
          actualValue: rawVal,
          expectedValue: cond.expectedValue,
          message: 'Value is not numeric',
          evidenceReference: primaryFact.source_url,
        };
      }
      const isMet = numVal <= Number(cond.expectedValue);
      return {
        conditionId: cond.id,
        field: cond.field,
        label: cond.label,
        status: isMet ? 'MET' : 'FAILED',
        actualValue: `${numVal} ${cond.unit || ''}`,
        expectedValue: `<= ${cond.expectedValue} ${cond.unit || ''}`,
        message: isMet ? `Value (${numVal}) meets threshold (<= ${cond.expectedValue})` : cond.failureMessage,
        evidenceReference: primaryFact.source_url,
      };
    }

    if (cond.operator === 'BOOLEAN' || typeof cond.expectedValue === 'boolean') {
      const lower = String(rawVal).toLowerCase();
      const isTruthy = lower.includes('true') || lower.includes('yes') || lower.includes('connected') || numVal === 1;
      const isFalsy = lower.includes('false') || lower.includes('no') || lower.includes('none') || numVal === 0;

      let actualBool: boolean | undefined = undefined;
      if (isTruthy) actualBool = true;
      if (isFalsy) actualBool = false;

      if (actualBool === undefined) {
        return {
          conditionId: cond.id,
          field: cond.field,
          label: cond.label,
          status: 'MISSING_DATA',
          actualValue: rawVal,
          expectedValue: cond.expectedValue,
          message: 'Unable to parse boolean value from fact',
        };
      }

      const isMet = actualBool === Boolean(cond.expectedValue);
      return {
        conditionId: cond.id,
        field: cond.field,
        label: cond.label,
        status: isMet ? 'MET' : 'FAILED',
        actualValue: String(actualBool),
        expectedValue: String(cond.expectedValue),
        message: isMet ? 'Condition verified' : cond.failureMessage,
        evidenceReference: primaryFact.source_url,
      };
    }

    // Default EQUALS
    const isMet = String(rawVal).trim().toLowerCase() === String(cond.expectedValue).trim().toLowerCase();
    return {
      conditionId: cond.id,
      field: cond.field,
      label: cond.label,
      status: isMet ? 'MET' : 'FAILED',
      actualValue: rawVal,
      expectedValue: String(cond.expectedValue),
      message: isMet ? 'Condition satisfied' : cond.failureMessage,
      evidenceReference: primaryFact.source_url,
    };
  }

  public matchBestMethodology(facts: Fact[], sector: string): MethodologyMatchingSummary | null {
    const candidates = MethodologyRegistry.getBySector(sector);
    if (candidates.length === 0) {
      // Return null or explicit unverified state if no official CCTS methodology matches the sector
      return null;
    }

    // Evaluate all candidates and pick the highest confidence match
    const evaluations = candidates.map((candidate) => this.evaluateMethodology(candidate, facts, sector));

    // Sort by status, matchedCount, and confidenceScore descending
    evaluations.sort((a, b) => {
      const statusWeight = { MATCH: 4, POTENTIAL_MATCH: 3, INSUFFICIENT_INFORMATION: 2, MISMATCH: 1 };
      const weightDiff = (statusWeight[b.status] || 0) - (statusWeight[a.status] || 0);
      if (weightDiff !== 0) return weightDiff;
      const matchCountDiff = b.matchedCount - a.matchedCount;
      if (matchCountDiff !== 0) return matchCountDiff;
      return b.confidenceScore - a.confidenceScore;
    });


    return evaluations[0] || null;
  }
}

export const methodologyMatcher = new MethodologyMatcher();
