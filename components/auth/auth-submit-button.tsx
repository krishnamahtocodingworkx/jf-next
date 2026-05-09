"use client";

import { LoadingButton } from "@/components/common/loading-button";

type AuthSubmitButtonProps = {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled?: boolean;
};

export function AuthSubmitButton({
  label,
  loadingLabel,
  isLoading,
  disabled,
}: AuthSubmitButtonProps) {
  return (
    <LoadingButton
      type="submit"
      isLoading={isLoading}
      loadingLabel={loadingLabel}
      disabled={isLoading || disabled}
      className="flex h-12 w-full items-center justify-center rounded-lg bg-teal-500 font-medium text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
      loaderClassName="text-white"
    >
      {label}
    </LoadingButton>
  );
}
