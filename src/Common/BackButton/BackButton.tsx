import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  return (
    <div className="cmnBackBtn">
    <button
      onClick={() => {
        navigate("/");
      }}
    >
     <ArrowLeftOutlined /> Back
    </button>
  </div>
  )
}

export default BackButton