"use client"; 

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

interface QueryClientProviderWrapperProps {
  children: ReactNode;
}

const QueryClientProviderWrapper: React.FC<QueryClientProviderWrapperProps> = ({
  children,
}) => {
  const queryClient = new QueryClient(); 

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryClientProviderWrapper;
