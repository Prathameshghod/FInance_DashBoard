import type { Transaction } from "../types";

export function transactionsToCsv(rows: Transaction[]): string {
  const header = ["date", "amount", "category", "type", "description"];
  const lines = [
    header.join(","),
    ...rows.map((t) =>
      [
        t.date,
        t.amount,
        JSON.stringify(t.category),
        t.type,
        JSON.stringify(t.description),
      ].join(","),
    ),
  ];
  return lines.join("\n");
}

export function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
