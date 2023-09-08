"use client";

import { useSupabase } from "@/app/supabase-provider";
import { Transaction } from "@/app/types/global";
import { DashboardContext } from "@/lib/context";
import { decryptTransactions, getTransactions, getUserId } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Balance } from "./total/balance";
import { Expenses } from "./total/expenses";
import { Incomes } from "./total/incomes";
import ExpensesChart from "./expenses/expenses-chart";
import IncomesChart from "./incomes/incomes-chart";
import Link from "next/link";
import { IncomesPieChart } from "./incomes-by-categories/incomes-piechart";
import { ExpensesPieChart } from "./expenses-by-categories/expenses-piechart";
import { ExpensesTable } from "./expenses-by-categories/expenses-table";
import { IncomesTable } from "./incomes-by-categories/incomes-table";
import ExpensesEvolutionChart from "./expenses/expenses-evolution-chart";
import IncomesEvolutionChart from "./incomes/incomes-evolution-chart";
import { DashboardRow } from "./ui/dashboard-row";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchData = async () => {
      const userId = await getUserId(supabase);

      if (!userId) {
        return;
      }
      const data = await getTransactions(supabase, userId);
      if (data) {
        const decryptData = decryptTransactions(data, userId);

        setTransactions(decryptData);
      }
    };

    fetchData();
  }, []);

  return transactions.length !== 0 ? (
    <DashboardContext.Provider value={{ transactions }}>
      <div className="flex flex-col w-2/3 gap-20">
        <DashboardRow>
          <Balance />
          <div className="flex gap-2">
            <Expenses />
            <Incomes />
          </div>
        </DashboardRow>

        <DashboardRow>
          <ExpensesTable />
          <IncomesTable />
        </DashboardRow>

        <DashboardRow>
          <ExpensesPieChart />
          <IncomesPieChart />
        </DashboardRow>

        <DashboardRow>
          <ExpensesChart />
          <IncomesChart />
        </DashboardRow>

        <DashboardRow>
          <ExpensesEvolutionChart />
          <IncomesEvolutionChart />
        </DashboardRow>
      </div>
    </DashboardContext.Provider>
  ) : (
    <div className="flex flex-col">
      <h1 className="text-xl mb-2">Welcome to Finance Graph 💸</h1>
      <button className="max-w-xs p-4 text-lg bg-black hover:bg-gray-800 rounded-md text-white">
        <Link href="/signin">Sign in to start</Link>
      </button>
    </div>
  );
}
