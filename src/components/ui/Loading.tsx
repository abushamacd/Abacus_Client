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
    </Row>
  );
};

export default Loading;
