/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import Loading from "../../../components/ui/Loading";
import { useGetInvoiceQuery } from "../../../redux/api/invoice";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { Card, Row } from "antd";

export const InvoiceDetails = () => {
  const [isEdit, setIsEdit] = useState(true);
  const params = useParams();
  const { data: invoiceData, isLoading: invoiceLoading } = useGetInvoiceQuery(
    params?.id
  );

  const invoice: any = invoiceData;

  const defaultValues = {
    customerId: invoice?.customerId || "",
    customerName: invoice?.customerName || "",
    date: invoice?.date || "",
    note: invoice?.note || "",
    updateBy: invoice?.updateBy || "",
    total: invoice?.total || 0,
    due: invoice?.due || 0,
    profit: invoice?.profit || 0,
    discount: invoice?.discount || 0,
  };

  if (invoiceLoading) {
    return <Loading />;
  }
  const products = JSON.parse(invoice?.products);
  // @ts-ignore
  console.log(defaultValues, products);
  return (
    <div>
      <section className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          title={
            <div className="flex gap-1 items-center">
              <span className="">Invoice Details</span>
              <span onClick={() => setIsEdit(!isEdit)} className="">
                {isEdit ? (
                  <FaEdit className={`text-xl text-primary`} />
                ) : (
                  <MdOutlineCancel className={`text-xl text-primary`} />
                )}
              </span>
            </div>
          }
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
        >
          <Row
            className="!mx-0"
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          ></Row>
        </Card>
      </section>
    </div>
  );
};
