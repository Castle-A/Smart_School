import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

interface ReceptorData {
    schoolName: string;
    studentName: string;
    matricule: string;
    class: string;
    amount: number;
    reason: string;
    method: string;
    reference?: string;
    date: Date;
    balance: number;
}

export const generateReceipt = (data: ReceptorData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // -- Header --
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text(data.schoolName.toUpperCase(), pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Reçu de Paiement / Payment Receipt", pageWidth / 2, 28, { align: 'center' });

    // -- Receipt Info box --
    doc.setDrawColor(200);
    doc.setFillColor(245, 247, 255);
    doc.rect(15, 35, pageWidth - 30, 40, 'FD');

    doc.setFontSize(10);
    doc.setTextColor(0);

    // Left column
    doc.text(`Date: ${format(data.date, 'dd/MM/yyyy HH:mm')}`, 20, 45);
    doc.text(`Réf: ${data.matricule}-${Date.now().toString().slice(-6)}`, 20, 52);

    // Right column
    doc.text(`Reçu par: COMPTABILITÉ`, 120, 45);
    doc.text(`Mode: ${data.method} ${data.reference ? `(${data.reference})` : ''}`, 120, 52);

    // -- Student Info --
    doc.setFontSize(14);
    doc.text(`Élève: ${data.studentName}`, 20, 70);
    doc.setFontSize(12);
    doc.text(`Classe: ${data.class} | Matricule: ${data.matricule}`, 20, 78);

    // -- Amount Blob --
    doc.setFillColor(79, 70, 229); // Indigo
    doc.rect(15, 90, pageWidth - 30, 25, 'F');
    doc.setTextColor(255);
    doc.setFontSize(16);
    doc.text(`Montant Versé: ${data.amount.toLocaleString()} FCFA`, pageWidth / 2, 107, { align: 'center' });

    // -- Details --
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text("Détails du Paiement:", 20, 130);

    const startY = 140;
    doc.setFontSize(10);
    doc.text(`Motif: ${data.reason}`, 25, startY);

    // -- Footer --
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, 170, pageWidth - 20, 170);

    doc.setFontSize(8);
    doc.text("Ce reçu est une preuve de paiement officielle. Veuillez le conserver.", pageWidth / 2, 180, { align: 'center' });
    doc.text(`Reste à payer: ${data.balance.toLocaleString()} FCFA`, pageWidth / 2, 185, { align: 'center' });

    // Save
    doc.save(`Recu_${data.matricule}_${format(new Date(), 'yyyyMMdd')}.pdf`);
};
