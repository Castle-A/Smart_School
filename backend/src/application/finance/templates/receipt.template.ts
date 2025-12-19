export const getReceiptHtml = (data: any) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; padding: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .school-name { font-size: 24px; font-weight: bold; color: #4F46E5; text-transform: uppercase; }
        .school-info { font-size: 12px; color: #666; margin-top: 5px; }
        .title { font-size: 18px; font-weight: bold; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .receipt-box { border: 1px solid #ddd; background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .label { font-weight: bold; color: #555; }
        .amount-box { background: #4F46E5; color: white; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; border-radius: 8px; margin: 30px 0; }
        .footer { text-align: center; font-size: 10px; color: #999; margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="school-name">${data.schoolName}</div>
        <div class="school-info">${data.schoolAddress || 'Adresse non renseignée'}</div>
        <div class="school-info">Tél: ${data.schoolPhone || '-'} | Email: ${data.schoolEmail || '-'}</div>
    </div>

    <div class="title">REÇU DE PAIEMENT / PAYMENT RECEIPT</div>

    <div class="receipt-box">
        <div class="row">
            <div>
                <span class="label">Date:</span> ${data.date}
            </div>
            <div>
                <span class="label">Réf:</span> ${data.receiptRef}
            </div>
        </div>
        <div class="row">
            <div>
                <span class="label">Mode:</span> ${data.method}
            </div>
            <div>
                <span class="label">Référence:</span> ${data.transactionRef || 'N/A'}
            </div>
        </div>
    </div>

    <div style="margin-bottom: 30px;">
        <div class="row">
            <div style="font-size: 16px;">
                <span class="label">Élève:</span> ${data.studentName}
            </div>
        </div>
        <div class="row">
             <div>
                <span class="label">Classe:</span> ${data.className}
            </div>
            <div>
                <span class="label">Matricule:</span> ${data.matricule}
            </div>
        </div>
    </div>

    <div class="amount-box">
        Montant Versé: ${data.amount} FCFA
    </div>

    <div class="row">
        <div>
            <span class="label">Motif:</span> ${data.reason}
        </div>
    </div>

    <div class="footer">
        <p>Ce reçu est généré électroniquement et fait foi de paiement.</p>
        <p>Solde restant à payer: ${data.balance} FCFA</p>
        <p>Généré le ${new Date().toLocaleString()} par ${data.cashierName || 'Comptabilité'}</p>
    </div>
</body>
</html>
`;
