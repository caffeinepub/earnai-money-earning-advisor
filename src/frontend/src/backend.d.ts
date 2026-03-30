import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EarningStrategy {
    title: string;
    estimatedEarnings: bigint;
    difficulty: string;
    description: string;
    category: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface SkillPath {
    title: string;
    description: string;
    potentialEarnings: bigint;
}
export interface EarningsRecord {
    source: string;
    date: bigint;
    amount: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Profile {
    currentBalance: bigint;
    name: string;
    monthlyGoal: bigint;
}
export interface FinancialTip {
    tip: string;
}
export interface SideHustle {
    title: string;
    description: string;
    timeCommitment: string;
    category: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    askAIAdvice(message: string): Promise<string>;
    createProfile(name: string, monthlyGoal: bigint): Promise<void>;
    getAllFinancialTips(): Promise<Array<FinancialTip>>;
    getAllHustles(): Promise<Array<SideHustle>>;
    getAllProfiles(): Promise<Array<Profile>>;
    getAllSkillPaths(): Promise<Array<SkillPath>>;
    getAllStrategies(): Promise<Array<EarningStrategy>>;
    getEarnings(): Promise<Array<EarningsRecord>>;
    getProfile(): Promise<Profile | null>;
    isDataSeeded(): Promise<boolean>;
    logEarnings(amount: bigint, source: string): Promise<void>;
    seedData(): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateBalance(amount: bigint): Promise<void>;
}
