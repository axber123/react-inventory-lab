import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, RotateCcw, Search } from "lucide-react";
import InventoryItem from "@/components/InventoryItem";
import { useAdjustInventory, useInventories } from "@/hooks/useInventories";
import { INVENTORY_CATEGORIES, STOCK_STATUS_LABELS } from "@/lib/inventory";
import type { InventoryCategory, StockStatus } from "@/types";

type InventoryFilters = {
  keyword: string;
  category: InventoryCategory | "";
  status: StockStatus | "";
};

function Inventory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo<InventoryFilters>(
    () => ({
      keyword: searchParams.get("keyword") ?? "",
      category: (searchParams.get("category") as InventoryCategory | null) ?? "",
      status: (searchParams.get("status") as StockStatus | null) ?? "",
    }),
    [searchParams],
  );
  const [keyword, setKeyword] = useState(query.keyword);

  const { data: inventories = [], isLoading, error } = useInventories(query);
  const adjustMutation = useAdjustInventory();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextParams = new URLSearchParams(searchParams);
    if (keyword.trim()) {
      nextParams.set("keyword", keyword.trim());
    } else {
      nextParams.delete("keyword");
    }

    setSearchParams(nextParams);
  }

  function handleReset() {
    setKeyword("");
    setSearchParams({});
  }

  function updateQueryParam(key: "category" | "status", value: string) {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  }

  if (isLoading) {
    return <p className="state-hint">正在加载库存...</p>;
  }

  if (error) {
    return (
      <p className="state-hint state-hint--error">
        错误：{error instanceof Error ? error.message : "请稍后重试"}
      </p>
    );
  }

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">库存管理</h1>
          <p className="page__desc">支持关键词、分类、库存状态组合筛选</p>
        </div>
      </div>

      {adjustMutation.error && (
        <p className="state-hint state-hint--error">
          库存调整失败：
          {adjustMutation.error instanceof Error
            ? adjustMutation.error.message
            : "请稍后重试"}
        </p>
      )}

      <form className="toolbar" onSubmit={handleSubmit}>
        <div className="toolbar__search">
          <Search aria-hidden="true" size={16} />
          <input
            className="field__input"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索物料编号 / 名称 / 库位"
            type="search"
          />
        </div>

        <label className="filter-select">
          <Filter aria-hidden="true" size={15} />
          <select
            value={query.category}
            onChange={(event) => updateQueryParam("category", event.target.value)}
          >
            <option value="">全部分类</option>
            {INVENTORY_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-select">
          <Filter aria-hidden="true" size={15} />
          <select
            value={query.status}
            onChange={(event) => updateQueryParam("status", event.target.value)}
          >
            <option value="">全部状态</option>
            {Object.entries(STOCK_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <button className="btn btn--primary" type="submit">
          查询
        </button>
        <button className="btn btn--ghost" type="button" onClick={handleReset}>
          <RotateCcw aria-hidden="true" size={15} />
          重置
        </button>
      </form>

      {inventories.length === 0 ? (
        <p className="state-hint">没有找到匹配物料，换个筛选条件试试。</p>
      ) : (
        <div className="item-list">
          {inventories.map((item) => (
            <InventoryItem
              key={item.matnr}
              item={item}
              isPending={
                adjustMutation.isPending &&
                adjustMutation.variables?.matnr === item.matnr
              }
              onAdjust={(delta) =>
                adjustMutation.mutate({ matnr: item.matnr, delta })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Inventory;
