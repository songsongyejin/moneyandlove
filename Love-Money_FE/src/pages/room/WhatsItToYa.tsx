import React, { useState } from "react";
import SelectTurn from "../../components/whatsittoya/SelectTurn";
import MainGame from "../../components/whatsittoya/MainGame";

const WhatsItToYa: React.FC = () => {
  const [showMainGame, setshowMainGame] = useState(false);
  const handleTurnSelected = () => {
    setshowMainGame(true);
  };

  return (
    <div className="absolute inset-0 bg-main-bg bg-cover bg-center">
      <div className="pt-30 fixed inset-0 z-50 flex items-center justify-center">
        {!showMainGame ? (
          <SelectTurn onTurnSelected={handleTurnSelected} />
        ) : (
          <MainGame />
        )}
      </div>
    </div>
  );
};

export default WhatsItToYa;
