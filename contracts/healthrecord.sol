// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RecordFactory {
    address[] public deployedrecords;
    mapping(address => bool) public records;
    address public manager;

    struct Doctor {
        address doc;
        string imageHash;
        string speciality;
        string description;
    }

    constructor() {
        manager = msg.sender;
    }

    mapping(address => Doctor) public docs;
    address[] public doctors;

    function createRecord(
        string memory name,
        string memory age,
        string memory gender,
        string memory height,
        string memory weight,
        address doctorAddress,
        string memory prescriptionHash,
        string memory mriHash,
        string memory imageHash
    ) public {
        healthrecord newRecord = new healthrecord(
            msg.sender,
            doctorAddress,
            name,
            age,
            gender,
            height,
            weight,
            imageHash
        );
        records[msg.sender] = true;
        deployedrecords.push(address(newRecord));
        if (bytes(mriHash).length != 0) {
            newRecord.setreportHash(doctorAddress, mriHash);
        }
        if (bytes(prescriptionHash).length != 0) {
            newRecord.setPrescriptionHash(doctorAddress, prescriptionHash);
        }
    }

    function getDeployedRecords() public view returns (address[] memory) {
        return deployedrecords;
    }

    function registerDoctor(
        address sender,
        string memory _imageHash,
        string memory _speciality,
        string memory _description
    ) public {
        require(msg.sender == manager, "Only manager can register a doctor");
        Doctor memory doc = Doctor({
            doc: sender,
            imageHash: _imageHash,
            speciality: _speciality,
            description: _description
        });
        docs[sender] = doc;
        doctors.push(sender);
    }

    function getDoctors() public view returns (address[] memory) {
        return doctors;
    }
}

contract healthrecord {
    struct Prescription {
        string hash;
        address doctor;
    }

    struct Report {
        string hash;
        address doctor;
    }

    Prescription[] private prescription;
    Report[] private report;
    address[] private doctor;
    string private profileHash;
    address private manager;
    string private name;
    string private age;
    string private gender;
    string private height;
    string private weight;

    constructor(
        address owner,
        address doctorAddress,
        string memory _name,
        string memory _age,
        string memory _gender,
        string memory _height,
        string memory _weight,
        string memory _profileHash
    ) {
        manager = owner;
        name = _name;
        age = _age;
        gender = _gender;
        height = _height;
        weight = _weight;
        profileHash = _profileHash;
        doctor.push(doctorAddress);
    }

    function setPrescriptionHash(address doc, string memory hash) public {
        prescription.push(Prescription(hash, doc));
    }

    function setreportHash(address doc, string memory hash) public {
        report.push(Report(hash, doc));
    }

    function getNameandAddress()
        public
        view
        returns (string memory, string memory, address, address[] memory)
    {
        return (name, profileHash, manager, doctor);
    }

    function getDetails()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        return (name, age, height, weight, gender);
    }

    function getPrescription(
        uint256 index
    ) public view returns (Prescription memory) {
        return prescription[index];
    }

    function getPrescriptionLength() public view returns (uint256) {
        return prescription.length;
    }

    function getReport(uint256 index) public view returns (Report memory) {
        return report[index];
    }

    function getReportLength() public view returns (uint256) {
        return report.length;
    }

    function getMyDoctors() public view returns (address[] memory) {
        return doctor;
    }

    function addToMyDoctors(address doc) public {
        doctor.push(doc);
    }
}
