import React, { useState } from "react";
import { Modal, Button } from "antd";
import "./CommonModal.scss"
interface CommonModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  customClass?: string;
}

const CommonModal: React.FC<CommonModalProps> = ({
  visible,
  onClose,
  title,
  content,
  customClass,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleOk = () => {
    // Logic for handling OK button click
    setConfirmLoading(true);
    setTimeout(() => {
      onClose(); // Close modal
      setConfirmLoading(false);
    }, 2000); // Simulating an asynchronous operation
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={onClose}
      centered
      footer={false}
      className={`commonModal ${customClass}`}
    >
      {content}
    </Modal>
  );
};

export default CommonModal;
