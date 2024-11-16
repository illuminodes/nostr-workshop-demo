const buildPatientResource = (id, name, contact, email) => {
    return {
        resourceType: "Patient",
        id: id,
        text: {
            status: "generated",
            div: `<div xmlns="http://www.w3.org/1999/xhtml">
              <p style="border: 1px #661aff solid; background-color: #e6e6ff; padding: 10px;">
                <b>${name} </b> 
                <span style="display: inline-block; margin-left: 10px;">${contact}</span>
                <span style="display: inline-block; margin-left: 10px;">${email}</span>
              </p>
            </div>`
        },
        active: true,
        name: name,
        telecom: [{
            system: "phone",
            value: contact,
            use: "mobile",
            rank: 2
        },
        {
            system: "email",
            value: email,
        }],
        deceasedBoolean: false,
    };
};

const generateObservation = (id, patientRef, patientDisplay) => {
    var glucoseValue = (Math.random() * 10).toFixed(1);
    var issuedDate = new Date().toISOString();
    var effectiveDate = new Date().toISOString();
    const observation = {
        resourceType: "Observation",
        id: id,
        text: {
            status: "generated",
            div: `
        <div xmlns="http://www.w3.org/1999/xhtml">
            <p style="border: 1px #661aff solid; background-color: #e6e6ff; padding: 10px;">
                <b>Glucose</b> in Blood
                <span style="display: inline-block; margin-left: 10px;">${glucoseValue} mmol/l</span>
                <span style="display: inline-block; margin-left: 10px;">${issuedDate}</span>
                <span style="display: inline-block; margin-left: 10px;">${effectiveDate}</span>
                <span style="display: inline-block; margin-left: 10px;">42pupusas</span>
                <span style="display: inline-block; margin-left: 10px;">${LAB_PUB_KEY}</span>
            </p>

        </div>`
        },
        status: "final",  // Hardcoded status
        code: {
            coding: [{
                system: "http://loinc.org",
                code: "15074-8",
                display: "Glucose [Moles/volume] in Blood"
            }]
        },
        subject: {
            reference: patientRef,
            display: patientDisplay
        },
        effectiveDateTime: effectiveDate,
        issued: issuedDate,
        performer: [{
            reference: LAB_PUB_KEY,
            display: "42's Totally Real Pathology Lab"
        }],
        valueQuantity: {
            value: (Math.random() * 10).toFixed(1),  // Random value for glucose level (0-10)
            unit: "mmol/l",
            system: "http://unitsofmeasure.org",
            code: "mmol/L"
        },
        interpretation: [{
            coding: [{
                system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                code: "H",  // Hardcoded interpretation code for "High"
                display: "High"
            }]
        }],
        referenceRange: [{
            low: {
                value: 3.1,
                unit: "mmol/l",
                system: "http://unitsofmeasure.org",
                code: "mmol/L"
            },
            high: {
                value: 6.2,
                unit: "mmol/l",
                system: "http://unitsofmeasure.org",
                code: "mmol/L"
            }
        }]
    };

    return observation;
}


