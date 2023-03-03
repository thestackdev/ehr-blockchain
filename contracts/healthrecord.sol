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
        require(!records[msg.sender], "Record already exists");
        healthrecord newRecord = new healthrecord(
            msg.sender,
            name,
            age,
            gender,
            height,
            weight,
            doctorAddress,
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
    string[] private prescriptionHash;
    string[] private reportHash;
    string private profileHash;
    address private manager;
    address private doctor;
    string private name;
    string private age;
    string private gender;
    string private height;
    string private weight;

    constructor(
        address owner,
        string memory _name,
        string memory _age,
        string memory _gender,
        string memory _height,
        string memory _weight,
        address doctorAddress,
        string memory _profileHash
    ) {
        manager = owner;
        name = _name;
        age = _age;
        gender = _gender;
        height = _height;
        weight = _weight;
        doctor = doctorAddress;
        profileHash = _profileHash;
    }

    modifier restricted() {
        require(msg.sender == manager || msg.sender == doctor, "Unauthorized");
        _;
    }

    function setPrescriptionHash(address sender, string memory hash) public {
        require(
            sender == doctor,
            "Only the doctor can add a prescription hash"
        );
        prescriptionHash.push(hash);
    }

    function setreportHash(address sender, string memory hash) public {
        require(sender == doctor, "Only the doctor can add a report hash");
        reportHash.push(hash);
    }

    function getNameandAddress()
        public
        view
        returns (
            string memory,
            string memory,
            address,
            address
        )
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
        require(
            msg.sender == manager || msg.sender == doctor,
            "Restricted to manager or doctor only"
        );
        return (name, age, height, weight, gender);
    }

    function getPrescription(uint256 index)
        public
        view
        restricted
        returns (string memory)
    {
        require(
            msg.sender == manager || msg.sender == doctor,
            "Restricted to manager or doctor only"
        );
        require(index < prescriptionHash.length, "Invalid index");
        return prescriptionHash[index];
    }

    function getPrescriptionLength() public view restricted returns (uint256) {
        require(
            msg.sender == manager || msg.sender == doctor,
            "Restricted to manager or doctor only"
        );
        return prescriptionHash.length;
    }

    function getReport(uint256 index)
        public
        view
        restricted
        returns (string memory)
    {
        require(
            msg.sender == manager || msg.sender == doctor,
            "Restricted to manager or doctor only"
        );
        require(index < reportHash.length, "Invalid index");
        return reportHash[index];
    }

    function getReportLength() public view restricted returns (uint256) {
        require(
            msg.sender == manager || msg.sender == doctor,
            "Restricted to manager or doctor only"
        );
        return reportHash.length;
    }
}
