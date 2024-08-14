import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PrismaClient, Customer, User } from "@prisma/client";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  serial: yup.string().required("Serial is required"),
  represent: yup.number().required("Representing staff is required"),
  contact: yup.string().required("Contact is required"),
  deleted: yup.boolean().required("Deleted status is required"),
});

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [personel, setUsers] = useState<User[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      deleted: false,
    },
  });

  useEffect(() => {
    fetchCustomers();
    fetchUsers();
  }, []);

  const fetchCustomers = async () => {
    const response = await fetch("/api/customers");
    const data = await response.json();
    setCustomers(data);
  };

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    setUsers(data);
  };

  const onSubmit = async (data: any) => {
    await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    reset();
    fetchCustomers();
  };

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Customers</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='mb-8'>
        <div className='mb-4'>
          <label className='block mb-2'>Name</label>
          <input {...register("name")} className='border p-2' />
          {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Serial</label>
          <input {...register("serial")} className='border p-2' />
          {errors.serial && (
            <p className='text-red-500'>{errors.serial.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <label className='block mb-2'>Representing Staff</label>
          <select {...register("represent")} className='border p-2'>
            <option value=''>Select a staff member</option>
            {personel.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.represent && (
            <p className='text-red-500'>{errors.represent.message}</p>
          )}
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Contact</label>
          <input {...register("contact")} className='border p-2' />
          {errors.contact && (
            <p className='text-red-500'>{errors.contact.message}</p>
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
        <button type='submit' className='bg-blue-500 text-white p-2'>
          Submit
        </button>
      </form>
      <table className='w-full'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Serial</th>
            <th>Representing Staff</th>
            <th>Contact</th>
            <th>Deleted</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.serial}</td>
              <td>
                {personel.find((user) => user.id === customer.represent)
                  ?.name || "N/A"}
              </td>
              <td>{customer.contact}</td>
              <td>{customer.deleted ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
