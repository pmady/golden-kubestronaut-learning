document.addEventListener('DOMContentLoaded', function() {
    // Exam costs
    const examCosts = {
        'KCNA': { price: 250, retake: 187.50, validity: 2 },
        'CKA': { price: 395, retake: 245, validity: 3 },
        'CKAD': { price: 395, retake: 245, validity: 3 },
        'CKS': { price: 395, retake: 245, validity: 2 },
        'KCSA': { price: 250, retake: 187.50, validity: 2 },
        'CNPA': { price: 250, retake: 187.50, validity: 2 },
        'CNPE': { price: 250, retake: 187.50, validity: 2 },
        'CGOA': { price: 250, retake: 187.50, validity: 2 },
        'CCA': { price: 250, retake: 187.50, validity: 2 },
        'PCA': { price: 250, retake: 187.50, validity: 2 },
        'ICA': { price: 250, retake: 187.50, validity: 2 },
        'OTCA': { price: 250, retake: 187.50, validity: 2 }
    };

    // Initialize the calculator
    function initCalculator() {
        const calculator = document.getElementById('cert-calculator');
        if (!calculator) return;

        // Add event listeners
        document.querySelectorAll('.cert-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateTotals);
        });

        document.getElementById('training-cost').addEventListener('input', updateTotals);
        document.getElementById('additional-cost').addEventListener('input', updateTotals);
        document.getElementById('retake-count').addEventListener('input', updateTotals);
    }

    // Update the total cost
    function updateTotals() {
        // Get selected certifications
        const selectedCerts = [];
        document.querySelectorAll('.cert-checkbox:checked').forEach(checkbox => {
            selectedCerts.push(checkbox.value);
        });

        // Calculate exam costs
        let examTotal = 0;
        let retakeCount = parseInt(document.getElementById('retake-count').value) || 0;
        
        selectedCerts.forEach(cert => {
            const certData = examCosts[cert];
            if (certData) {
                examTotal += certData.price;
                // Add retake costs if any
                if (retakeCount > 0) {
                    examTotal += (certData.retake * Math.min(retakeCount, 3)); // Max 3 retakes
                }
            }
        });

        // Get other costs
        const trainingCost = parseFloat(document.getElementById('training-cost').value) || 0;
        const additionalCost = parseFloat(document.getElementById('additional-cost').value) || 0;
        
        // Calculate total
        const total = examTotal + trainingCost + additionalCost;

        // Update UI
        document.getElementById('exam-total').textContent = `$${examTotal.toFixed(2)}`;
        document.getElementById('training-total').textContent = `$${trainingCost.toFixed(2)}`;
        document.getElementById('additional-total').textContent = `$${additionalCost.toFixed(2)}`;
        document.getElementById('grand-total').textContent = `$${total.toFixed(2)}`;
    }

    // Initialize the calculator when the page loads
    initCalculator();
});
