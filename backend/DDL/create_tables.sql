drop database pms;
create database pms;
USE pms;

CREATE TABLE Incharge (
    EmpID VARCHAR(20) PRIMARY KEY,
    ManagerID VARCHAR(20),
    InchargeName VARCHAR(20) NOT NULL,
    Salary INT,
    FOREIGN KEY (ManagerID) REFERENCES Incharge(EMPID)
);

CREATE TABLE Owner (
    OwnerID VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL
);

CREATE TABLE ParkingZone (
    ZoneCode VARCHAR(10) PRIMARY KEY,
    InchargeID VARCHAR(20) NOT NULL,
    Capacity INT NOT NULL,
    FOREIGN KEY (InchargeID) REFERENCES Incharge(EmpID)
);

CREATE TABLE Vehicle (
    VehicleRegNo VARCHAR(20) PRIMARY KEY,
    OwnerID VARCHAR(20) NOT NULL,
    Brand VARCHAR(20),
    YearOfManufacture YEAR,
    VehicleType VARCHAR(10) NOT NULL,
    FOREIGN KEY (OwnerID) REFERENCES Owner(OwnerID)
);

CREATE TABLE ParkingSlot (
    SlotID VARCHAR(10) PRIMARY KEY,
    VehicleRegNo VARCHAR(20),
    ZoneCode VARCHAR(10) NOT NULL,
    Type VARCHAR(10) NOT NULL,
    FOREIGN KEY (VehicleRegNo) REFERENCES Vehicle(VehicleRegNo),
    FOREIGN KEY (ZoneCode) REFERENCES ParkingZone(ZoneCode)
);

CREATE TABLE InchargePhoneDirectory (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    EmpID VARCHAR(20),
    PhoneNumber VARCHAR(20) UNIQUE NOT NULL,
    FOREIGN KEY (EmpID) REFERENCES Incharge(EmpID)
);

CREATE TABLE OwnerPhoneDirectory (
	ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    OwnerID VARCHAR(20),
    PhoneNumber VARCHAR(20) UNIQUE NOT NULL,
    FOREIGN KEY (OwnerID) REFERENCES Owner(OwnerID)
);