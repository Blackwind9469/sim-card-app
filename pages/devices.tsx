import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PrismaClient, Device } from "@prisma/client";

const schema = yup.object().shape({
  serial: yup.string().required("Serial is required"),
  type: yup.string().required("Type is required"),
  deleted: yup.boolean().required("Deleted status is required"),
  used: yup.boolean().required("Used status is required"),
});

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      deleted: false,
      used: false,
    },
  });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    const response = await fetch("/api/devices");
    const data = await response.json();
    setDevices(data);
  };

  const onSubmit = async (data: any) => {
    await fetch("/api/devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    reset();
    fetchDevices();
  };

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Devices</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='mb-8'>
        <div className='mb-4'>
          <label className='block mb-2'>Serial</label>
          <input {...register("serial")} className='border p-2' />
          {errors.serial && (
            <p className='text-red-500'>{errors.serial.message}</p>
          )}
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Device Type</label>
          <input {...register("type")} className='border p-2' />
          {errors.type && <p className='text-red-500'>{errors.type.message}</p>}
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Deleted</label>
          <div>
            <label className='inline-flex items-center mr-4'>
              <input
                type='radio'
                {...register("deleted")}
                value='false'
                className='form-radio'
              />
              <span className='ml-2'>False</span>
            </label>
            <label className='inline-flex items-center'>
              <input
                type='radio'
                {...register("deleted")}
                value='true'
                className='form-radio'
              />
              <span className='ml-2'>True</span>
            </label>
          </div>
          {errors.deleted && (
            <p className='text-red-500'>{errors.deleted.message}</p>
          )}
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Used</label>
          <div>
            <label className='inline-flex items-center mr-4'>
              <input
                type='radio'
                {...register("used")}
                value='false'
                className='form-radio'
              />
              <span className='ml-2'>False</span>
            </label>
            <label className='inline-flex items-center'>
              <input
                type='radio'
                {...register("used")}
                value='true'
                className='form-radio'
              />
              <span className='ml-2'>True</span>
            </label>
          </div>
          {errors.used && <p className='text-red-500'>{errors.used.message}</p>}
        </div>
        <button type='submit' className='bg-blue-500 text-white p-2'>
          Submit
        </button>
      </form>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border p-2 text-left'>Device Serial</th>
            <th className='border p-2 text-left'>Device Type</th>
            <th className='border p-2 text-left'>Deleted</th>
            <th className='border p-2 text-left'>Used</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
              <td>{device.serial}</td>
              <td>{device.type}</td>
              <td>{device.deleted ? "Yes" : "No"}</td>
              <td>{device.used ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
