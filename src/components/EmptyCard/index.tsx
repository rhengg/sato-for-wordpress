import { Text } from "@wordpress/ui";
import { Button } from "@wordpress/components";
import "./EmptyCard.css";

interface EmptyPlayersStateProps {
  onButtonClick?: () => void;
  buttonText?: string;
  buttonIcon?: any;
  heading?: string;
  description?: string;
  imageSrc?: string;
}

const EmptyPlayersState = ({
  onButtonClick,
  buttonText,
  buttonIcon,
  heading,
  description,
  imageSrc,
}: EmptyPlayersStateProps) => {
  return (
    <div className="emptyContainer">
      <div className="emptyImageContainer">
        <span className="material-symbols-outlined filled">{imageSrc}</span>
      </div>

      <Text variant="body-xl" style={{ marginBottom: "1rem" }}>
        {heading}
      </Text>

      <Text
        variant="body-lg"
        style={{
          marginBottom: "1.5rem",
          maxWidth: "25rem",
        }}
      >
        {description}
      </Text>
      {buttonText && (
        <Button
          __next40pxDefaultSize={true}
          variant="primary"
          icon={buttonIcon ? buttonIcon : "plus"}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyPlayersState;
