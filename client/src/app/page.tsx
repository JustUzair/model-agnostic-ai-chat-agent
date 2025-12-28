"use client";

import { useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Answer = {
  question: string;
  summary: string;
  confidence: number;
};
export default function Home() {
  const [query, setQuery] = useState<String>("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleQuerySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (!q || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: q,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Request Failed...");
      const { summary, confidence } = data as {
        summary: string;
        confidence: number;
      };

      setAnswers(prev => [{ summary, confidence, question: q }, ...prev]);
      setQuery("");
      inputRef.current?.focus();

      console.log(`Data \n`, data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-dvh w-full bg-zinc-50">
      <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-24 pt-8">
        <header className="mb-4">
          <h1 className="text-xl font-semibold tracking-tight">
            Agnostic Agent | AMA
          </h1>
        </header>
        <Card className="flex-1">
          <CardTitle className="pl-4">Answers</CardTitle>
          <CardContent className="space-y-3">
            {answers.length == 0 ? (
              <p className="text-sm text-zinc-600">
                No answers yet. Start asking...
              </p>
            ) : (
              answers.map((answer, index) => {
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-zinc-300 p-3"
                  >
                    <div className="text-sm font-medium text-zinc-900">
                      Q: {answer.question}
                    </div>
                    <div className="text-sm loading-6 mt-1">
                      {answer.summary}
                    </div>
                    <div className="text-xs mt-1 text-zinc-500">
                      {(+answer.confidence * 100).toFixed(2)}%
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
        <form
          ref={formRef}
          onSubmit={handleQuerySubmit}
          className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-2xl px-4 py-4 backdrop-blur"
        >
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type your query here..."
              disabled={loading}
              className="h-11"
            />

            <Button type="submit" disabled={loading} className="h-11">
              {loading ? "Thinking..." : "Ask"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
