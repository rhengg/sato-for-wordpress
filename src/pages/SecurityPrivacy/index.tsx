import TwoFA from "../../components/TwoFA";
import DeleteAccount from "../../components/DeleteAccount";
import Loader from "../../components/Loader";
import React from "react";
import axios from "../../utils/axios-instance";

const SecurityPrivacyPage = ({ token }: { token: string }) => {
  const [user, setUser] = React.useState<any>();

  const fetchUserDetail = async () => {
    try {
      const res = await axios.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (error) {
      console.log("error fetching user detail", error);
    }
  };

  React.useEffect(() => {
    fetchUserDetail();
  }, []);

  if (!user)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader
          height="64px"
          width="64px"
          borderColor="#f0f0f0"
          borderBottom="#000000"
        />
      </div>
    );

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <TwoFA email={user.email} enabled={user.twoFAEnabled} token={token} />

      <DeleteAccount email={user.email} />
    </div>
  );
};

export default SecurityPrivacyPage;
