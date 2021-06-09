/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import ReactTooltip from "react-tooltip";

const OwnerCard = ({ ownerDetails, blocked }) => {
  return (
    <>
      {ownerDetails ? (
        blocked ? (
          <>
            <a data-tip data-for="ownerCardTooltip">
              <div className="card mb-3 owner-card-blocked">
                <div className="row g-0">
                  <div className="col-md-12">
                    <p className="card-text">
                      <strong>OWNER CONTACT CARD</strong>
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <ReactTooltip id="ownerCardTooltip" effect="solid" place="bottom">
              <span>
                &nbsp;&nbsp;you have to be logged in <br></br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;in
                order to see <br></br>the owner's contact details
              </span>
            </ReactTooltip>
          </>
        ) : (
          <div className="card mb-3 owner-card">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={process.env.REACT_APP_FILE_UPLOAD_PATH + ownerDetails.avatar}
                  alt="Owner profile avatar"
                  className="img-fluid p-2"
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h6 className="card-title">{ownerDetails.name}</h6>
                  <p className="card-text">
                    <strong>Phone:</strong> {ownerDetails.phone}
                  </p>
                  <p className="card-text">
                    <strong>Email:</strong> {ownerDetails.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default OwnerCard;
