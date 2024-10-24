import { Component } from "react";
import { FingerprintReader, SampleFormat } from "@digitalpersona/devices";

import axios from "axios";

class Pb3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Read the Instructions before starting enrollment",
      ListaFingerPrint: [],
      InfoFingerprintReader: null,
      ListaSamplesFingerPrints: null,
      currentImageFinger: null,
      errorMessage: null,
      serverResponse: null,
      reader: new FingerprintReader(),
    };
  }

  componentDidMount() {
    const { reader } = this.state;
    // Asociar eventos con métodos
    reader.on("DeviceConnected", this.onDeviceConnected);
    reader.on("DeviceDisconnected", this.onDeviceDisconnected);
    reader.on("SamplesAcquired", this.onSamplesAcquired);
    reader.on("AcquisitionStarted", this.onAcquisitionStarted);
    reader.on("AcquisitionStopped", this.onAcquisitionStopped);
  }

  componentWillUnmount() {
    const { reader } = this.state;
    // Eliminar asociación de eventos
    reader.off("DeviceConnected", this.onDeviceConnected);
    reader.off("DeviceDisconnected", this.onDeviceDisconnected);
    reader.off("SamplesAcquired", this.onSamplesAcquired);
    reader.off("AcquisitionStarted", this.onAcquisitionStarted);
    reader.off("AcquisitionStopped", this.onAcquisitionStopped);
  }

  // Handle Events
  onDeviceConnected = (ev) => {
    console.log("Connected ", ev);
  };

  onDeviceDisconnected = (ev) => {
    console.log("Disconnected ", ev);
  };

  onSamplesAcquired = (ev) => {
    console.log("In the event: SamplesAcquired");
    console.log(ev);
    this.setState({ ListaSamplesFingerPrints: ev });
  };

  onAcquisitionStarted = (ev) => {
    console.log("In the event: AcquisitionStarted ");
    console.log(ev);
  };

  onAcquisitionStopped = (ev) => {
    console.log("In the event: AcquisitionStopped ");
    console.log(ev);
  };

  // Métodos para interactuar con el lector de huellas
  fn_ListarDispositivos = () => {
    const { reader } = this.state;
    reader
      .enumerateDevices()
      .then((devices) => this.setState({ ListaFingerPrint: devices }))
      .catch((error) => console.log(error));
  };

  fn_DeviceInfo = () => {
    const { ListaFingerPrint } = this.state;
    const dispositivo = ListaFingerPrint[0];
    if (dispositivo) {
      const InfoFingerprintReader = JSON.stringify(dispositivo).replace(
        /[[\]"]/g,
        ""
      );
      console.log(InfoFingerprintReader);
      this.setState({ InfoFingerprintReader });
    }
  };

  fn_startCapture = () => {
    const { reader, InfoFingerprintReader } = this.state;
    //reader.startAcquisition(SampleFormat.PngImage, InfoFingerprintReader) regresa base64
    reader
      .startAcquisition(SampleFormat.PngImage, InfoFingerprintReader)

      .then((response) => {
        console.log("Starting capture");
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  fn_stopCapture = () => {
    const { reader, ListaFingerPrint } = this.state;
    reader
      .stopAcquisition(ListaFingerPrint[0])
      .then((response) => {
        console.log("Stopping capture");
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  fn_CaptureImage = () => {
    const { ListaSamplesFingerPrints } = this.state;

    if (
      ListaSamplesFingerPrints &&
      ListaSamplesFingerPrints.samples.length > 0
    ) {
      let base64 = ListaSamplesFingerPrints.samples[0]; // For PNG
      console.log("VER ", ListaSamplesFingerPrints.samples[0]);

      // Clean the Base64 string
      base64 = base64.replace(/_/g, "/");
      base64 = base64.replace(/-/g, "+");
      console.log("Base cleaned  ", base64);

      // Update state with the captured image
      this.setState({ currentImageFinger: base64 });
      console.log("Captured image");
    } else {
      console.log("Fingerprint not captured");
    }
  };

  handleValidate = async () => {
    const { currentImageFinger } = this.state;

    // Check if the image exists
    if (!currentImageFinger) {
      this.setState({ errorMessage: "No fingerprint image captured!" });
      return;
    }

    try {
      // Send the fingerprint image to the server for validation
      const response = await axios.post("https://authbackend-3ce93569ffa7.herokuapp.com/validatefingerprint", {
        image: currentImageFinger,
      });

      // Handle the response from the server
      if (response.data.message === "Fingerprint match") {
        const {
          firstName,
          lastName,
          middleName,
          profilePicture,
          matchPercentage,
        } = response.data;
        this.setState({
          serverResponse: {
            message: `Match found: ${firstName} ${middleName} ${lastName} (Match Percentage: ${matchPercentage.toFixed(
              2
            )}%)`,
            profilePicture: profilePicture,
          },
          errorMessage: null,
        });
      } else {
        // Handle cases where no match is found
        this.setState({
          serverResponse: {
            message: "Fingerprint mismatch",
            profilePicture: null,
          },
          errorMessage: null,
        });
      }
    } catch (error) {
      console.error("Error validating fingerprint:", error);
      if (error.response) {
        const errorMessage =
          error.response.data.message ||
          "Error validating fingerprint. Please try again.";
        this.setState({
          errorMessage: errorMessage,
        });
      } else {
        this.setState({
          errorMessage: "Error validating fingerprint. Please try again.",
        });
      }
    }
  };

  render() {
    const { title, currentImageFinger, errorMessage} =
      this.state;
    return (
      <div className="flex flex-col gap-[15px]">
        <h1 className="mt-[20px] self-center font-montserrat text-[15px] font-medium text-darkgreen ">
          {title}
        </h1>
        <div className="px-[15px] py-[15px] bg-gray rounded self-center ">
          <p className="font-montserrat font-light text-[13px] w-[600px] ">
            <span className="font-montserrat font-medium text-white text-[13px] ">
              Feature Notice :
            </span>{" "}
            The "List Devices" and "Device Info" functionalities have been
            temporarily disabled to streamline the user experience and focus on
            core fingerprint capture feature. To capture your fingerprint, click
            "Start Capture" and place your finger on the scanner. Once the
            fingerprint is read, press "Capture Image" to save it. When
            finished, click "Stop Capture" to end the process.
          </p>
        </div>
        <div className="flex flex-col self-center mt-[48px]">
          {/* Display error message at the top */}
          {errorMessage && (
            <p className="text-red font-montserrat text-[13px] self-center mt-[10px]">
              {errorMessage}
            </p>
          )}
          <div>
            {/* This display the captured image if successfull */}
            {currentImageFinger && (
              <img
                src={`data:image/png;base64,${currentImageFinger}`}
                alt={this.state.firstName}
              />
            )}
          </div>
          <div className="flex gap-[15px]">
            <button
              className="bg-red py-[9px] rounded font-bold px-[9px] mb-[6px] text-[13px] text-white font-montserrat "
              onClick={this.fn_startCapture}
            >
              Start Capture
            </button>
            <button
              className="bg-yellow py-[9px] rounded font-bold px-[9px] mb-[6px] text-[13px] font-montserrat "
              onClick={this.fn_stopCapture}
            >
              Stop Capture
            </button>
            <button
              className="bg-orange py-[9px] rounded font-bold px-[9px] mb-[6px] text-[13px]  font-montserrat "
              onClick={this.fn_CaptureImage}
            >
              Capture Image
            </button>
          </div>
          <button
            className="bg-darkgreen w-[100px] self-center mt-[20px] py-[9px] rounded font-bold px-[9px] mb-[6px] text-[13px] text-white font-montserrat "
            onClick={() => {}}
          >
            Validate
          </button>
        </div>
        {this.state.serverResponse && (
          <>
            {/* If the response contains validation details */}
            {this.state.serverResponse.message &&
            this.state.serverResponse.firstName ? (
              <div className="flex justify-between mt-[20px]">
                <div className="flex flex-col gap-[8px]">
                  <div>
                    <strong>First Name:</strong>{" "}
                    {this.state.serverResponse.firstName}
                  </div>
                  <div>
                    <strong>Last Name:</strong>{" "}
                    {this.state.serverResponse.lastName}
                  </div>
                  <div>
                    <strong>Middle Name:</strong>{" "}
                    {this.state.serverResponse.middleName}
                  </div>
                </div>

                <div>
                  {this.state.serverResponse.profilePicture && (
                    <img
                      src={this.state.serverResponse.profilePicture}
                      alt="Profile Picture"
                      style={{ width: "180px", height: "auto" }}
                    />
                  )}
                </div>
              </div>
            ) : (
              /* Unsuccessful validation */
              <p className="text-red font-montserrat text-[13px] self-center mt-[20px]">
                {this.state.serverResponse.message || "Fingerprint mismatch"}
              </p>
            )}
          </>
        )}
      </div>
    );
  }
}

export default Pb3;
