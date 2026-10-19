import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus, RefreshCw } from "lucide-react";
import { useAdjustInventory, useInventoryDetail } from "@/hooks/useInventories";
import { getStockStatus, getStockStatusLabel } from "@/lib/inventory";

function InventoryDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: item, isLoading, error, refetch, isFetching } =
    useInventoryDetail(id);
  const adjustMutation = useAdjustInventory();

  if (isLoading) {
    return <p className="state-hint">正在加载物料详情...</p>;
  }

  if (error) {
    return (
      <div className="page">
        <p className="state-hint state-hint--error">
          加载失败：{error instanceof Error ? error.message : "请稍后重试"}
        </p>
        <button
          className="btn btn--ghost"
          onClick={() => navigate("/inventory")}
        >
          <ArrowLeft aria-hidden="true" size={16} />
          返回库存列表
        </button>
      </div>
    );
  }

  if (!item) {
    return <p className="state-hint">物料不存在。</p>;
  }

  const status = getStockStatus(item);
  const statusLabel = getStockStatusLabel(item);

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">库存详情</h1>
          <p className="page__desc">直接访问详情链接时，Detail Query 会独立请求。</p>
        </div>
        <button
          className="btn btn--ghost"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw aria-hidden="true" size={16} />
          {isFetching ? "刷新中" : "刷新"}
        </button>
      </div>

      <div className="detail-card">
        <div className="detail-card__row">
          <span className="detail-card__label">物料编号</span>
          <span className="detail-card__value">{id}</span>
        </div>

        <div className="detail-card__row">
          <span className="detail-card__label">物料名称</span>
          <span className="detail-card__value">{item.name}</span>
        </div>

        <div className="detail-card__row">
          <span className="detail-card__label">物料分类</span>
          <span className="detail-card__value">{item.category}</span>
        </div>

        <div className="detail-card__row">
          <span className="detail-card__label">库位</span>
          <span className="detail-card__value">{item.location}</span>
        </div>

        <div className="detail-card__row">
          <span className="detail-card__label">当前数量</span>
          <span className="detail-card__value detail-card__quantity">
            {item.quantity} {item.unit}
            <span className="detail-card__actions">
              <button
                className="btn btn--step"
                onClick={() => adjustMutation.mutate({ matnr: item.matnr, delta: -1 })}
                disabled={item.quantity === 0 || adjustMutation.isPending}
                aria-label={`减少 ${item.name} 库存`}
              >
                <Minus aria-hidden="true" size={16} />
              </button>
              <button
                className="btn btn--step"
                onClick={() => adjustMutation.mutate({ matnr: item.matnr, delta: 1 })}
                disabled={adjustMutation.isPending}
                aria-label={`增加 ${item.name} 库存`}
              >
                <Plus aria-hidden="true" size={16} />
              </button>
            </span>
          </span>
        </div>

        <div className="detail-card__row">
          <span className="detail-card__label">安全库存</span>
          <span className="detail-card__value">
            {item.minStock} {item.unit}
          </span>
        </div>

        <div className="detail-card__row">
          <span className="detail-card__label">库存状态</span>
          <span className="detail-card__value">
            <span className={`stock-tag stock-tag--${status}`}>
              {statusLabel}
            </span>
          </span>
        </div>

        <div className="detail-card__row">
          <span className="detail-card__label">更新时间</span>
          <span className="detail-card__value">
            {new Date(item.updatedAt).toLocaleString("zh-CN")}
          </span>
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

      <button className="btn btn--ghost" onClick={() => navigate(-1)}>
        <ArrowLeft aria-hidden="true" size={16} />
        返回
      </button>
    </div>
  );
}

export default InventoryDetail;
