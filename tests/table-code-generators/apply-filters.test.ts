import { describe, expect, it } from "vitest";
import { applyFilters } from "@/lib/table-generator/generate-columns";
import type { ColumnConfig } from "@/types/table-types";

describe("applyFilters", () => {
  const sampleData = [
    { id: 1, name: "John", age: 25, tags: ["developer", "react"], active: true, created: "2023-01-01" },
    { id: 2, name: "Jane", age: 30, tags: ["designer", "ui"], active: false, created: "2023-02-01" },
    { id: 3, name: "Bob", age: 35, tags: ["developer", "vue"], active: true, created: "2023-03-01" },
    { id: 4, name: "Alice", age: 28, tags: ["manager"], active: true, created: "2023-04-01" },
  ];

  const columns: ColumnConfig[] = [
    { id: "name", accessor: "name", label: "Name", type: "string", order: 0, filterable: true },
    { id: "age", accessor: "age", label: "Age", type: "number", order: 1, filterable: true },
    { id: "tags", accessor: "tags", label: "Tags", type: "array", order: 2, filterable: true },
    { id: "active", accessor: "active", label: "Active", type: "boolean", order: 3, filterable: true },
    { id: "created", accessor: "created", label: "Created", type: "date", order: 4, filterable: true },
  ];

  it("should filter by string contains", () => {
    const filters: Array<{ field: string; operator: string; values: unknown[] }> = [{ field: "name", operator: "contains", values: ["Jo"] }];
    const result = applyFilters(sampleData, filters, columns);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("John");
  });

  it("should filter by number greater_than", () => {
    const filters: Array<{ field: string; operator: string; values: unknown[] }> = [{ field: "age", operator: "greater_than", values: [28] }];
    const result = applyFilters(sampleData, filters, columns);
    expect(result).toHaveLength(2);
    expect(result.map(r => r.age)).toEqual([30, 35]);
  });

  it("should filter by array is_any_of", () => {
    const filters: Array<{ field: string; operator: string; values: unknown[] }> = [{ field: "tags", operator: "is_any_of", values: ["developer"] }];
    const result = applyFilters(sampleData, filters, columns);
    expect(result).toHaveLength(2);
    expect(result.map(r => r.name)).toEqual(["John", "Bob"]);
  });

  it("should filter by array includes_all", () => {
    const filters: Array<{ field: string; operator: string; values: unknown[] }> = [{ field: "tags", operator: "includes_all", values: ["developer", "react"] }];
    const result = applyFilters(sampleData, filters, columns);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("John");
  });

  it("should filter by boolean is", () => {
    const filters: Array<{ field: string; operator: string; values: unknown[] }> = [{ field: "active", operator: "is", values: [true] }];
    const result = applyFilters(sampleData, filters, columns);
    expect(result).toHaveLength(3);
    expect(result.map(r => r.name)).toEqual(["John", "Bob", "Alice"]);
  });

  it("should filter by date before", () => {
    const filters: Array<{ field: string; operator: string; values: unknown[] }> = [{ field: "created", operator: "before", values: ["2023-03-01"] }];
    const result = applyFilters(sampleData, filters, columns);
    expect(result).toHaveLength(2);
    expect(result.map(r => r.name)).toEqual(["John", "Jane"]);
  });

  it("should handle empty filters", () => {
    const filters: Array<{ field: string; operator: string; values: unknown[] }> = [];
    const result = applyFilters(sampleData, filters, columns);
    expect(result).toHaveLength(4);
  });

  it("should handle filters with empty values", () => {
    const filters: Array<{ field: string; operator: string; values: unknown[] }> = [{ field: "name", operator: "contains", values: [""] }];
    const result = applyFilters(sampleData, filters, columns);
    expect(result).toHaveLength(4); // Empty filter should be ignored
  });

  it("should handle multiple filters", () => {
    const filters: Array<{ field: string; operator: string; values: unknown[] }> = [
      { field: "age", operator: "greater_than", values: [25] },
      { field: "active", operator: "is", values: [true] },
    ];
    const result = applyFilters(sampleData, filters, columns);
    expect(result).toHaveLength(2);
    expect(result.map(r => r.name)).toEqual(["Bob", "Alice"]);
  });

  it("should handle empty operator", () => {
    const filters: Array<{ field: string; operator: string; values: unknown[] }> = [{ field: "name", operator: "empty", values: [] }];
    const result = applyFilters(sampleData, filters, columns);
    expect(result).toHaveLength(0); // No empty names
  });

  it("should handle not_empty operator", () => {
    const filters: Array<{ field: string; operator: string; values: unknown[] }> = [{ field: "name", operator: "not_empty", values: [] }];
    const result = applyFilters(sampleData, filters, columns);
    expect(result).toHaveLength(4); // All names are not empty
  });

  it("should handle starts_with operator", () => {
    const filters: Array<{ field: string; operator: string; values: unknown[] }> = [{ field: "name", operator: "starts_with", values: ["J"] }];
    const result = applyFilters(sampleData, filters, columns);
    expect(result).toHaveLength(2);
    expect(result.map(r => r.name)).toEqual(["John", "Jane"]);
  });

  it("should handle ends_with operator", () => {
    const filters: Array<{ field: string; operator: string; values: unknown[] }> = [{ field: "name", operator: "ends_with", values: ["e"] }];
    const result = applyFilters(sampleData, filters, columns);
    expect(result).toHaveLength(2);
    expect(result.map(r => r.name)).toEqual(["Jane", "Alice"]);
  });
});