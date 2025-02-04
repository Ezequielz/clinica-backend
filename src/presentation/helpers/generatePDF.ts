import PDFDocument from "pdfkit";
import prisma from '../../lib/prisma';

interface Props {
    orderId: string;
    dataCallback: (chunk: Buffer) => void;
    endCallback: () => void;
}


export const generatePDF = async (
    id: string,
    dataCallback: (chunk: Buffer) => void,
    endCallback: () => void,
) => {
    try {
        // Obtener la orden y sus detalles
        const order = await prisma.order.findFirst({
            where: { id, pagado: true },
            include: {
                paciente: { include: { user: true } },
                consultas: {
                    include: {
                        servicio: true,
                        paquete: { include: { servicios_incluidos: { include: { servicio: true } } } },
                        medico: { include: { user: true } },
                        turnosReservados: { include: { turno: true, medico: { include: { user: true } } } },
                    },
                },
            },
        });

        if (!order) throw new Error("Orden no encontrada");

        return new Promise((resolve, reject) => {
            // Crear el PDF en memoria
            const doc = new PDFDocument();


            doc.on("data", dataCallback);
            doc.on("end", endCallback);

            // Agregar contenido al PDF
            doc.fontSize(20).text("Factura de Orden", { align: "center" });
            doc.moveDown();

            doc.fontSize(14).text(`Orden ID: ${order.id}`);
            doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
            doc.text(`Paciente: ${order.paciente.user.nombre} ${order.paciente.user.apellido}`);
            doc.text(`Total Pagado: $${order.monto_total.toFixed(2)}`);
            doc.moveDown();

            doc.text("Servicios y Paquetes:");
            order.consultas.forEach((consulta, index) => {
                doc.moveDown();
                doc.text(`  ${index + 1}. ${consulta.servicio ? consulta.servicio.nombre : "Paquete"} - Médico: ${consulta.medico.user.nombre} ${consulta.medico.user.apellido}`);
                if (consulta.paquete) {
                    doc.text("     Paquete Incluye:");
                    consulta.paquete.servicios_incluidos.forEach((servicioPack) => {
                        doc.text(`       - ${servicioPack.servicio.nombre}`);
                    });
                }
                consulta.turnosReservados.forEach((turno) => {
                    doc.text(`     Turno: ${turno.fecha_turno.toLocaleDateString()} - ${turno.hora_turno}`);
                });
            });

            doc.end();
        });
    } catch (error) {
        console.error("Error generando el PDF:", error);
        return null;
    }
};
