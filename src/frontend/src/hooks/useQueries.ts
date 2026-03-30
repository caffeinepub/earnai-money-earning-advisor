import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  EarningStrategy,
  EarningsRecord,
  FinancialTip,
  Profile,
  SideHustle,
  SkillPath,
} from "../backend.d";
import { useActor } from "./useActor";

export type {
  EarningStrategy,
  SideHustle,
  SkillPath,
  EarningsRecord,
  Profile,
  FinancialTip,
};

export function useProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<Profile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStrategies() {
  const { actor, isFetching } = useActor();
  return useQuery<EarningStrategy[]>({
    queryKey: ["strategies"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStrategies();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useHustles() {
  const { actor, isFetching } = useActor();
  return useQuery<SideHustle[]>({
    queryKey: ["hustles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHustles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSkillPaths() {
  const { actor, isFetching } = useActor();
  return useQuery<SkillPath[]>({
    queryKey: ["skillPaths"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSkillPaths();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEarnings() {
  const { actor, isFetching } = useActor();
  return useQuery<EarningsRecord[]>({
    queryKey: ["earnings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEarnings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTips() {
  const { actor, isFetching } = useActor();
  return useQuery<FinancialTip[]>({
    queryKey: ["tips"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFinancialTips();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsDataSeeded() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isDataSeeded"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isDataSeeded();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      monthlyGoal,
    }: { name: string; monthlyGoal: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.createProfile(name, monthlyGoal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useLogEarnings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      amount,
      source,
    }: { amount: bigint; source: string }) => {
      if (!actor) throw new Error("No actor");
      await actor.logEarnings(amount, source);
      await actor.updateBalance(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["earnings"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useAskAI() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (message: string) => {
      if (!actor) throw new Error("No actor");
      return actor.askAIAdvice(message);
    },
  });
}
