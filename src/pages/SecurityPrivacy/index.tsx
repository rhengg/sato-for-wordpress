import { decodeBase64 } from "../../utils/base64";
import Cookies from "js-cookie";
import TwoFA from "../../components/TwoFA";
import DeleteAccount from "../../components/DeleteAccount";
import packagejson from "../../../package.json";
import Loader from "../../components/Loader";

const SecurityPrivacyPage = () => {
  const user = decodeBase64(Cookies.get("s-user") as string);

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
        // padding: "24px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <TwoFA email={user.email} enabled={user.twoFAEnabled} />

      <DeleteAccount email={user.email} />

      {/* <div className="version-container-profile">
        <p className="label" style={{ marginTop: "0.5rem" }}>
          Version {packagejson.version}
        </p>
      </div> */}
    </div>
  );
};

export default SecurityPrivacyPage;
