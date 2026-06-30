import "./seocard.css";
import { videoconfigupdate } from "../../pages/Detail";

type SEOcardProps = {
  title?: string;
  setReRender?: any;
  setDisableSaveButton?: any;
};

const Index = (props: SEOcardProps) => {
  const { title, setReRender, setDisableSaveButton } = props;

  return (
    <>
      <div className="seo-card-container">
        <div>
          <p className="input-title">Video Name</p>
          <input
            className="input-secondary"
            style={{ width: "100%" }}
            autoComplete="off"
            type="text"
            maxLength={30}
            defaultValue={title}
            onInput={(e: any) => {
              if (e.target.value === "" || !e.target.value) {
                videoconfigupdate.value.playercontrol.video_name = false;
                videoconfigupdate.value.videotitle = e.target.value;
                setReRender(Math.random());
                setDisableSaveButton(false);
                return;
              }
              videoconfigupdate.value.videotitle = e.target.value;
              videoconfigupdate.value.playercontrol.video_name = true;
              setReRender(Math.random() * 1000);
              setDisableSaveButton(false);
            }}
            name="video-title"
            placeholder="Your video title"
          />
        </div>
      </div>
    </>
  );
};

export default Index;
