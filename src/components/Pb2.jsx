import { Component } from "react";
import { FingerprintReader, SampleFormat } from "@digitalpersona/devices";

import axios from "axios";

class Pb2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Read the Instructions before starting enrollment",
      firstName: "",
      lastName: "",
      middleName: "",
      profilePhoto: null,
      imagePreview: null,
      ListaFingerPrint: [],
      InfoFingerprintReader: null,
      ListaSamplesFingerPrints: null,
      currentImageFinger: null,
      errorMessage: null,
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

  handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({ profilePhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  // Form submission and validation logic
  handleSubmit = async () => {
    const {
      firstName,
      lastName,
      middleName,
      profilePhoto,
      currentImageFinger,
    } = this.state;

    // Clear the error message if all fields are valid
    this.setState({ errorMessage: null });
    // Validate that all fields are filled
    if (
      !firstName ||
      !lastName ||
      !middleName ||
      !profilePhoto ||
      !currentImageFinger
    ) {
      this.setState({
        errorMessage: "Please fill all the details before submitting.",
      });
      return;
    }

    // Form data to send to the server
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("middleName", middleName);
    formData.append("profilePhoto", profilePhoto); // Sending file as FormData
    formData.append("fingerprintImage", currentImageFinger); // Sending base64 image

    try {
      const response = await axios.post("https://authbackend-3ce93569ffa7.herokuapp.com/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Multipart/form-data for files
      });

      console.log("Data successfully sent to the server:", response.data);

      // Clear the form after successful submission
      this.setState({
        firstName: "",
        lastName: "",
        middleName: "",
        profilePhoto: null,
        imagePreview: null,
        currentImageFinger: null,
        errorMessage: "Data sent successfully! You can submit again.",
      });
    } catch (error) {
      console.error(
        "Error sending data to server:",
        error.response ? error.response.data : error.message
      );
    }
  };

  render() {
    const { title, currentImageFinger } = this.state;
    return (
      <div className="flex flex-col gap-[15px]">
        <h1 className="mt-[20px] ml-[80px] self-center font-montserrat text-[15px] font-medium text-darkgreen ">
          {title}
        </h1>
        <div className="px-[15px] ml-[80px] py-[15px] bg-gray rounded self-center ">
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
        {!this.state.errorMessage ? (
          <></>
        ) : (
          <p className="mt-[6px] font-montserrat text-red text-black self-center text-[14px]">
            {this.state.errorMessage}
          </p>
        )}
        <div className="flex mt-[25px] gap-[50px]">
          <div>
            <p className="font-montserrat font-medium ml-[45px]">
              Fill in Details and Start Capturing
            </p>
            <div className="flex flex-col gap-[5px] mt-[20px] ml-[45px] ">
              <label className="font-montserrat text-[13px] ">
                First Name:
              </label>
              <input
                type="text"
                name="firstName"
                className="border pl-[8px] font-montserrat py-[5px] text-[13px] w-[180px] rounded border-gray h-[30px]  "
                value={this.state.firstName}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col mt-[15px] gap-[5px] ml-[45px] ">
              <label className="font-montserrat text-[13px] ">Last Name:</label>
              <input
                type="text"
                name="lastName"
                className="border pl-[8px] font-montserrat py-[5px] text-[13px] w-[180px] rounded border-gray h-[30px]  "
                value={this.state.lastName}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col mt-[15px] gap-[5px] ml-[45px] ">
              <label className="font-montserrat text-[13px] ">
                Middle Name:
              </label>
              <input
                type="text"
                name="middleName"
                className="border pl-[8px] font-montserrat py-[5px] text-[13px] w-[180px] rounded border-gray h-[30px]  "
                value={this.state.middleName}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col mt-[15px] gap-[5px] ml-[45px] ">
              <label className="font-montserrat text-[13px]">
                Profile Photo:
              </label>
              <input
                type="file"
                className="font-monteserrat text-[13px]"
                accept="image/*"
                onChange={this.handleFileChange}
                required
              />
            </div>
          </div>
          <div>
            {this.state.imagePreview && (
              <div className="ml-[-70px] mt-[78px] border p-[10px] ">
                <img
                  src={this.state.imagePreview}
                  alt="Profile Preview"
                  style={{ width: "150px", height: "auto" }}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col mt-[78px]">
            <div>
              {/* This display the captured image if successfull */}
              {currentImageFinger && (
                <img className="w-[180px] h-[180px] "
                  src={`data:image/png;base64,${currentImageFinger}`}
                  alt={this.state.firstName}
                />
              )}
            </div>
            {/* <button
              className="bg-green font-montserrat "
              onClick={this.fn_ListarDispositivos}
            >
              List Devices
            </button>
            <button
              className="bg-green font-montserrat "
              onClick={this.fn_DeviceInfo}
            >
              Device Info
            </button> */}
            <div className="flex ml-[30px] gap-[15px]">
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
              className="bg-darkgreen w-[100px] self-center ml-[20px] mt-[20px] py-[9px] rounded font-bold px-[9px] mb-[6px] text-[13px] text-white font-montserrat "
              onClick={() => {
                console.log('clicked! dev check');
                this.handleSubmit();
              }}
            >
              submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Pb2;
