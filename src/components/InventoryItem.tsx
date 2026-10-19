import { Link } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import {
  getStockStatus,
  getStockStatusLabel,
} from "@/lib/inventory";
import type { Inventory } from "@/types";

type InventoryItemProps = {
  item: Inventory;
  isPending?: boolean;
  onAdjust: (delta: 1 | -1) => void;
};

function InventoryItem({
  item,
  isPending = false,
  onAdjust,
}: InventoryItemProps) {
  const status = getStockStatus(item);
  const statusLabel = getStockStatusLabel(item);

  return (
    <div className="item-row">
      <Link to={`/inventory/${item.matnr}`} className="item-row__code">
        {item.matnr}
      </Link>

      <div className="item-row__main">
        <Link to={`/inventory/${item.matnr}`} className="item-row__name">
          {item.name}
        </Link>
        <p className="item-row__meta">
          {item.category} · {item.location} · 安全库存 {item.minStock}
          {item.unit}
        </p>
      </div>

      <span className={`stock-tag stock-tag--${status}`}>{statusLabel}</span>
      <div className="item-row__qty">
        <button
          className="btn btn--step"
          onClick={() => onAdjust(-1)}
          disabled={item.quantity === 0 || isPending}
          aria-label={`减少 ${item.name} 库存`}
        >
          <Minus aria-hidden="true" size={16} />
        </button>

        <span key={item.quantity} className="item-row__num">
          {item.quantity}
        </span>

        <button
          className="btn btn--step"
          onClick={() => onAdjust(1)}
          disabled={isPending}
          aria-label={`增加 ${item.name} 库存`}
        >
          <Plus aria-hidden="true" size={16} />
        </button>
      </div>
    </div>
  );
}

export default InventoryItem;
