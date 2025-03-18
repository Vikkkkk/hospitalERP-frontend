import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/hooks';
import { fetchDepartmentInventoryById } from '../redux/actions/departmentInventoryActions';
import { selectDepartmentInventoryItems, selectDepartmentInventoryLoading } from '../redux/selectors/departmentInventorySelectors';
import { selectDepartments } from '../redux/selectors/departmentSelectors';

import { Select, Spin, message } from 'antd';
import InventoryTable from '../components/InventoryTable';
import RequestInventoryModal from '../components/RequestInventoryModal';
import RestockModal from '../components/RestockModal';
import DepartmentInventoryCheckoutModal from '../components/DepartmentInventoryCheckoutModal';
import InventoryHistory from '../components/InventoryHistory';

const DepartmentInventory: React.FC = () => {
  const dispatch = useAppDispatch();

  const departments = useSelector(selectDepartments);
  const inventoryItems = useSelector(selectDepartmentInventoryItems);
  const loading = useSelector(selectDepartmentInventoryLoading);
  const user = useSelector((state: any) => state.auth.user); // 🛡️ Fetch current user

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // ⛔ Lock department for department-bound users
  useEffect(() => {
    if (!user?.isglobalrole && user?.departmentId) {
      setSelectedDepartmentId(user.departmentId);
    }
  }, [user]);

  // 📦 Fetch Inventory when department changes
  useEffect(() => {
    if (selectedDepartmentId !== null) {
      dispatch(fetchDepartmentInventoryById(selectedDepartmentId));
    }
  }, [dispatch, selectedDepartmentId]);

  const handleSelectItems = (selectedRowKeys: React.Key[]) => {
    setSelectedItems(selectedRowKeys as number[]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏢 部门库存管理 (二级库)</h1>

      {/* 🧩 Department Selector */}
      <div className="mb-4">
        <Select
          placeholder="请选择一个部门"
          style={{ width: 240 }}
          onChange={(value: number) => setSelectedDepartmentId(value)}
          value={selectedDepartmentId ?? undefined}
          disabled={!user?.isglobalrole} // 🔐 Lock for non-global users
        >
          {departments.map((dept) => (
            <Select.Option key={dept.id} value={dept.id}>
              {dept.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {selectedDepartmentId === null ? (
        <p>⚠️ 请先选择一个部门以查看库存。</p>
      ) : loading ? (
        <Spin spinning={true} tip="加载部门库存...">
          <div style={{ height: '100px' }} />
        </Spin>
      ) : (
        <InventoryTable
          data={inventoryItems}
          type="department"
          loading={loading}
          onSelectItems={handleSelectItems}
        />
      )}

      {/* 🔧 Actions */}
      <div className="mt-4 flex gap-4">
        <button className="btn-primary" onClick={() => setShowRequestModal(true)}>
          ➕ 申请库存 (IR/PR)
        </button>
        <button className="btn-secondary" onClick={() => setShowRestockModal(true)}>
          ♻️ 补货申请
        </button>
        <button
          className="btn-accent"
          disabled={selectedItems.length === 0}
          onClick={() => setShowCheckoutModal(true)}
        >
          ✅ 核销物资
        </button>
      </div>

      {/* 📊 Inventory History */}
      <div className="mt-8">
      <InventoryHistory
        context="department"
        isGlobalUser={user?.isglobalrole ?? false}
        userDepartmentId={user?.departmentId ?? null}
        selectedDepartmentId={selectedDepartmentId}
      />
      </div>

      {/* 🧩 Modals */}
      {showRequestModal && selectedDepartmentId && (
        <RequestInventoryModal
          departmentId={selectedDepartmentId}
          visible={showRequestModal}
          onClose={() => setShowRequestModal(false)}
        />
      )}

      {showRestockModal && (
        <RestockModal
          selectedItems={selectedItems}
          visible={showRestockModal}
          onClose={() => setShowRestockModal(false)}
          type="department"
        />
      )}

      {showCheckoutModal && (
        <DepartmentInventoryCheckoutModal
          items={inventoryItems.filter(item => selectedItems.includes(item.id))}
          visible={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
        />
      )}
    </div>
  );
};

export default DepartmentInventory;