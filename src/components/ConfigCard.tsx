import './ConfigCard.css';

interface ConfigCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  count: number;
  onClick: () => void;
}

function ConfigCard({ icon, title, description, count, onClick }: ConfigCardProps) {
  return (
    <button className="config-card" onClick={onClick}>
      <div className="config-card-icon">{icon}</div>
      <div className="config-card-body">
        <h3 className="config-card-title">{title}</h3>
        <p className="config-card-description">{description}</p>
      </div>
      <span className="config-card-count">{count}</span>
    </button>
  );
}

export default ConfigCard;
