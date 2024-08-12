import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import styles from "../styles/Contracts.module.css";

interface Sim {
  id: number;
  serial: string;
  gsmno: string;
  tariff: string;
}

interface Customer {
  id: number;
  name: string;
  serial: string;
  represent: number;
}

interface Device {
  id: number;
  serial: string;
  type: string;
}

interface ContractFormData {
  simId: number;
  customerId: number;
  deviceId: number;
  type: string;
  licensePlate: string;
  start: string;
  finish: string;
}

export default function ContractsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [sims, setSims] = useState<Sim[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [formData, setFormData] = useState<ContractFormData>({
    simId: 0,
    customerId: 0,
    deviceId: 0,
    type: "",
    licensePlate: "",
    start: "",
    finish: "",
  });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchSims();
      fetchCustomers();
      fetchDevices();
    }
  }, [isLoaded, isSignedIn]);

  const fetchSims = async () => {
    const response = await axios.get("/api/sims");
    setSims(response.data);
  };

  const fetchCustomers = async () => {
    const response = await axios.get("/api/customers");
    setCustomers(response.data);
  };

  const fetchDevices = async () => {
    const response = await axios.get("/api/devices");
    setDevices(response.data);
  };

  const handleSimChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSim = sims.find((sim) => sim.id === parseInt(e.target.value));
    if (selectedSim) {
      setFormData({
        ...formData,
        simId: selectedSim.id,
      });
    }
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCustomer = customers.find(
      (customer) => customer.id === parseInt(e.target.value)
    );
    if (selectedCustomer) {
      setFormData({
        ...formData,
        customerId: selectedCustomer.id,
      });
    }
  };

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDevice = devices.find(
      (device) => device.id === parseInt(e.target.value)
    );
    if (selectedDevice) {
      setFormData({
        ...formData,
        deviceId: selectedDevice.id,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/contracts", formData);
      alert("Contract created successfully!");
      // Reset form or redirect
    } catch (error) {
      console.error("Error creating contract:", error);
      alert("Error creating contract. Please try again.");
    }
  };

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Create New Contract</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={`${styles.formSection} ${styles.simSection}`}>
          <h3>SIM Information</h3>
          <select
            name='simId'
            onChange={handleSimChange}
            required
            className={styles.formInput}
          >
            <option value=''>Select SIM</option>
            {sims.map((sim) => (
              <option key={sim.id} value={sim.id}>
                {sim.serial}
              </option>
            ))}
          </select>
          <input
            type='text'
            value={sims.find((s) => s.id === formData.simId)?.gsmno || ""}
            readOnly
            className={styles.formInput}
          />
          <input
            type='text'
            value={sims.find((s) => s.id === formData.simId)?.tariff || ""}
            readOnly
            className={styles.formInput}
          />
        </div>

        <div className={`${styles.formSection} ${styles.customerSection}`}>
          <h3>Customer Information</h3>
          <select
            name='customerId'
            onChange={handleCustomerChange}
            required
            className={styles.formInput}
          >
            <option value=''>Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          <input
            type='text'
            value={
              customers.find((c) => c.id === formData.customerId)?.serial || ""
            }
            readOnly
            className={styles.formInput}
          />
          <input
            type='text'
            value={
              customers
                .find((c) => c.id === formData.customerId)
                ?.represent.toString() || ""
            }
            readOnly
            className={styles.formInput}
          />
        </div>

        <div className={`${styles.formSection} ${styles.deviceSection}`}>
          <h3>Device Information</h3>
          <select
            name='deviceId'
            onChange={handleDeviceChange}
            required
            className={styles.formInput}
          >
            <option value=''>Select Device</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.serial}
              </option>
            ))}
          </select>
          <input
            type='text'
            value={devices.find((d) => d.id === formData.deviceId)?.type || ""}
            readOnly
            className={styles.formInput}
          />
        </div>

        <div className={`${styles.formSection} ${styles.contractSection}`}>
          <h3>Contract Information</h3>
          <input
            type='text'
            name='type'
            placeholder='Contract Type'
            onChange={handleInputChange}
            required
            className={styles.formInput}
          />
          <input
            type='text'
            name='licensePlate'
            placeholder='License Plate'
            onChange={handleInputChange}
            required
            className={styles.formInput}
          />
          <input
            type='date'
            name='start'
            onChange={handleInputChange}
            required
            className={styles.formInput}
          />
          <input
            type='date'
            name='finish'
            onChange={handleInputChange}
            required
            className={styles.formInput}
          />
        </div>

        <button type='submit' className={styles.submitButton}>
          Create Contract
        </button>
      </form>
    </div>
  );
}
