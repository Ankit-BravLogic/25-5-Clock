const { useState } = React;


const buttons = [
    { id: "clear", value: "AC", type: "clear" },
    { id: "divide", value: "/", type: "operator" },
    { id: "multiply", value: "*", type: "operator" },

    { id: "seven", value: "7", type: "number" },
    { id: "eight", value: "8", type: "number" },
    { id: "nine", value: "9", type: "number" },
    { id: "subtract", value: "-", type: "operator" },

    { id: "four", value: "4", type: "number" },
    { id: "five", value: "5", type: "number" },
    { id: "six", value: "6", type: "number" },
    { id: "add", value: "+", type: "operator" },

    { id: "one", value: "1", type: "number" },
    { id: "two", value: "2", type: "number" },
    { id: "three", value: "3", type: "number" },

    { id: "zero", value: "0", type: "number" },
    { id: "decimal", value: ".", type: "decimal" },
    { id: "equals", value: "=", type: "equals" }
];


function App() {

    const [expression, setExpression] = useState("");
    const [display, setDisplay] = useState("0");
    const [justCalculated, setJustCalculated] = useState(false);


    // -----------------------------
    // NUMBER
    // -----------------------------

    function handleNumber(value) {

        if (justCalculated) {
            setExpression(value);
            setDisplay(value);
            setJustCalculated(false);
            return;
        }

        let current = expression;

        // Find the last number/operator portion
        const match = current.match(/(-?\d*\.?\d*)$/);
        const currentNumber = match ? match[0] : "";

        // Prevent multiple leading zeros
        if (currentNumber === "0") {

            if (value === "0") {
                return;
            }

            current =
                current.slice(0, -1) + value;

        } else if (currentNumber === "-0") {

            if (value === "0") {
                return;
            }

            current =
                current.slice(0, -2) + "-" + value;

        } else {

            current += value;
        }

        setExpression(current);
        setDisplay(current);
    }


    // -----------------------------
    // DECIMAL
    // -----------------------------

    function handleDecimal() {

        if (justCalculated) {
            setExpression("0.");
            setDisplay("0.");
            setJustCalculated(false);
            return;
        }

        const match =
            expression.match(/(-?\d*\.?\d*)$/);

        const currentNumber =
            match ? match[0] : "";

        // Don't allow two decimal points
        if (currentNumber.includes(".")) {
            return;
        }

        let newExpression = expression;

        // Empty expression
        if (newExpression === "") {
            newExpression = "0.";
        }

        // Decimal immediately after an operator
        else if (
            /[+\-*/]$/.test(newExpression)
        ) {
            newExpression += "0.";
        }

        else {
            newExpression += ".";
        }

        setExpression(newExpression);
        setDisplay(newExpression);
    }


    // -----------------------------
    // OPERATORS
    // -----------------------------

    function handleOperator(operator) {

        if (expression === "") {
            // Allow negative number as first input
            if (operator === "-") {
                setExpression("-");
                setDisplay("-");
            }

            return;
        }


        // After "=":
        // Continue calculation from result
        if (justCalculated) {

            setExpression(
                display + operator
            );

            setDisplay(
                display + operator
            );

            setJustCalculated(false);

            return;
        }


        let current = expression;


        // Expression currently ends with operator
        if (/[+\-*/]$/.test(current)) {

            // Special case:
            // 5 * - 5
            if (
                operator === "-" &&
                !current.endsWith("-")
            ) {
                current += "-";
            }

            // 5 + * 7
            else {

                // Replace the existing operator
                current =
                    current.slice(0, -1) + operator;
            }

        }

        else {

            current += operator;
        }


        setExpression(current);
        setDisplay(current);
    }


    // -----------------------------
    // EQUALS
    // -----------------------------

    function calculate() {

        if (expression === "") {
            return;
        }


        let formula = expression;


        // Remove trailing operators
        formula =
            formula.replace(/[+\-*/]+$/, "");


        if (
            formula === "" ||
            formula === "-"
        ) {
            return;
        }


        // Only allow calculator characters
        if (!/^[0-9+\-*/.]+$/.test(formula)) {
            return;
        }


        try {

            const result =
                Function(
                    `"use strict"; return (${formula})`
                )();


            if (
                typeof result !== "number" ||
                !Number.isFinite(result)
            ) {
                setDisplay("Error");
                setExpression("");
                return;
            }


            // Keep reasonable precision
            const rounded =
                Number(
                    parseFloat(result.toFixed(10))
                );


            setDisplay(String(rounded));

            setExpression(String(rounded));

            setJustCalculated(true);

        } catch (error) {

            setDisplay("Error");

            setExpression("");

        }
    }


    // -----------------------------
    // CLEAR
    // -----------------------------

    function clearCalculator() {

        setExpression("");

        setDisplay("0");

        setJustCalculated(false);
    }


    // -----------------------------
    // BUTTON HANDLER
    // -----------------------------

    function handleButton(button) {

        switch (button.type) {

            case "number":
                handleNumber(button.value);
                break;

            case "decimal":
                handleDecimal();
                break;

            case "operator":
                handleOperator(button.value);
                break;

            case "equals":
                calculate();
                break;

            case "clear":
                clearCalculator();
                break;

            default:
                break;
        }
    }


    return (

        <div className="page">

            <div id="calculator">

                <div className="heading">
                    <h1>React Calculator</h1>
                    <p>Simple • Fast • Precise</p>
                </div>


                <div id="display">
                    {display}
                </div>


                <div className="buttons">

                    {buttons.map(button => (

                        <button
                            key={button.id}
                            id={button.id}
                            className={button.type}
                            onClick={() =>
                                handleButton(button)
                            }
                        >
                            {button.value}
                        </button>

                    ))}

                </div>

            </div>


            <p className="footer">
                Built with React
            </p>

        </div>
    );
}


const root =
    ReactDOM.createRoot(
        document.getElementById("root")
    );


root.render(<App />);