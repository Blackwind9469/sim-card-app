import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PrismaClient, Sim } from "@prisma/client";

const schema = yup.object().shape({
  serial: yup.string().required("Serial is required"),
  gsmno: yup.string().required("GSM number is required"),
  tariff: yup.string().required("Tariff is required"),
  deleted: yup.boolean().required("Deleted status is required"),
  used: yup.boolean().required("Used status is required"),
});

export default function SimsPage() {
  const [sims, setSims] = useState<Sim[]>([]);
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
    fetchSims();
  }, []);

  const fetchSims = async () => {
    const response = await fetch("/api/sims");
    const data = await response.json();
    setSims(data);
  };

  const onSubmit = async (data: any) => {
    await fetch("/api/sims", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    reset();
    fetchSims();
  };

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Sims</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='mb-8'>
        <div className='mb-4'>
          <label className='block mb-2'>Serial</label>
          <input {...register("serial")} className='border p-2' />
          {errors.serial && (
            <p className='text-red-500'>{errors.serial.message}</p>
          )}
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>GSM Number</label>
          <input {...register("gsmno")} className='border p-2' />
          {errors.gsmno && (
            <p className='text-red-500'>{errors.gsmno.message}</p>
          )}
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Tariff</label>
          <input {...register("tariff")} className='border p-2' />
          {errors.tariff && (
            <p className='text-red-500'>{errors.tariff.message}</p>
          )}
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
            <th className='border p-2 text-left'>Serial</th>
            <th className='border p-2 text-left'>GSM Number</th>
            <th className='border p-2 text-left'>Tariff</th>
            <th className='border p-2 text-left'>Deleted</th>
            <th className='border p-2 text-left'>Used</th>
          </tr>
        </thead>
        <tbody>
          {sims.map((sim) => (
            <tr key={sim.id}>
              <td>{sim.serial}</td>
              <td>{sim.gsmno}</td>
              <td>{sim.tariff}</td>
              <td>{sim.deleted ? "Yes" : "No"}</td>
              <td>{sim.used ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
