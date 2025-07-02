import { Row } from "antd";

const Loading = () => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: "100vh",
      }}
    >
      <div className="loading_container">
        <div className="top">
          <div className="square">
            <div className="square">
              <div className="square">
                <div className="square">
                  <div className="square">
                    <div className="square"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="square">
            <div className="square">
              <div className="square">
                <div className="square">
                  <div className="square">
                    <div className="square"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="left">
          <div className="square">
            <div className="square">
              <div className="square">
                <div className="square">
                  <div className="square">
                    <div className="square"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="square">
            <div className="square">
              <div className="square">
                <div className="square">
                  <div className="square">
                    <div className="square"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p>Note: Site i s hosted in free hosting, so it's maybe slow.</p>
    </Row>
  );
};

export default Loading;
