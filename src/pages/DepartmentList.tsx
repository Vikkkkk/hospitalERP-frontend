import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDepartments, deleteDepartment } from '../redux/actions/departmentActions';
import { RootState, AppDispatch } from '../redux/store';
import { Button, Table, Space } from 'antd';
import CreateDepartmentModal from '../components/CreateDepartmentModal';
import AssignDepartmentHeadModal from '../components/AssignDepartmentHeadModal';

const DepartmentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { departments, loading } = useSelector((state: RootState) => state.department);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteDepartment(id));
  };

  const columns = [
    {
      title: 'Department Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <AssignDepartmentHeadModal departmentId={record.id} />
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Department Management</h2>
      <CreateDepartmentModal />
      <Table columns={columns} dataSource={departments} loading={loading} rowKey="id" />
    </div>
  );
};

export default DepartmentList;