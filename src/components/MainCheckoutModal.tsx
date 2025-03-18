import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, message, Spin } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import { useAppDispatch } from '../redux/hooks';
import { completeCheckoutRequest, generateCheckoutQRCode } from '../redux/actions/inventoryRequestActions';

interface Props {
  visible: boolean;
  onClose: () => void;
  requestId: number;
  selectedItems: number[]; // ✅ Accept multiple, use first
}

const CheckoutModal: React.FC<Props> = ({ visible, onClose, requestId }) => {
  const dispatch = useAppDispatch();
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [manualUser, setManualUser] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQRCode = async () => {
      setLoading(true);
      const result = await dispatch(generateCheckoutQRCode(requestId));
      if (generateCheckoutQRCode.fulfilled.match(result)) {
        setQrCodeData(result.payload.qrCode);
      } else {
        message.error('无法生成二维码，请手动输入用户名');
      }
      setLoading(false);
    };

    if (visible) {
      fetchQRCode();
    }
  }, [visible, requestId, dispatch]);

  const handleCheckout = async () => {
    setLoading(true);
    const result = await dispatch(completeCheckoutRequest({ id: requestId, checkoutUser: manualUser || undefined }));

    if (completeCheckoutRequest.fulfilled.match(result)) {
      message.success('核销成功');
      setQrCodeData(null);
      setManualUser('');
      onClose();
    } else {
      message.error('核销失败');
    }
    setLoading(false);
  };

  return (
    <Modal
      title="核销物资"
      visible={visible}
      onCancel={onClose}
      onOk={handleCheckout}
      okText="确认核销"
    >
      {loading ? (
        <Spin spinning={true} tip="加载中...">
        <div style={{ height: '100px' }} /> {/* Placeholder space */}
      </Spin>
      ) : (
        <>
          {qrCodeData ? (
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <QRCodeCanvas value={qrCodeData} size={200} />
              <p style={{ marginTop: 10 }}>请用企业微信扫码核销</p>
            </div>
          ) : (
            <>
              <Input
                placeholder="请输入用户名"
                value={manualUser}
                onChange={(e) => setManualUser(e.target.value)}
              />
              <p style={{ fontSize: 12, marginTop: 8 }}>⚠️ 无法扫码？请手动输入用户名</p>
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default CheckoutModal;