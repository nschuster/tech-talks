---
series: "Quantum Computing Fundamentals"
title: "Part 2: The Deutsch–Jozsa Problem and Quantum Supremacy"
type: article
date: 2023-11-30
image: "/posts/img/NS-QuantumComputingFundamentals/title-image1.jpg"
draft: false
tags: ["Quantum Computing", "Quantum Mechanics", "Entanglement", "Cloud", "Infrastructure"]
authors:
 - Niklas Schuster
summary: "This blog article is the start of a series to introduces the fundamentals of quantum computation to create a broad understanding of how contum computers actually work and how they are different to classical computers. It includes a brief introduction to quantum mechanics and linear algebra in order to show exactly where the difference is between classical arithmetic operations and quantum-based arithmetic operations."
---
# Part 1: Recap
In the previous part of our blog series we learnt that classical computers work with bits to project a binary system with exactly two fixed states 0 and 1. While classical computers relies on deteministic physics, quantum computers arebased on the laws of quantum mechanics, wich introduces a level of uncertainty and quantum effects like superposition let us leverage qubits that can exist in multiple states simultaneously. That results in a unique set of quantum operations like the Hadamard gate, offering an extended toolkit beyond what classical computation models are able to do. This opens doors to a whole new level of computation to solve problems where classical computers have difficulties. However, this proof remained open in the last part, that's why in this part we will mainly focus on the Deutsch-Jorza problem where we will prove for the first time that quantum computers can outperform classical computers.

## The Deutsch-Jorza Problem and the road to Quantum Surpremacy

The Deutsch-Jorza Problem was first proposed by David Deutsch and Richard Jozsa in 1992 and is one of the first and simplest examples to prove that quantum computers can solve a problem faster than any deterministic classical computer and that even exponentially. To describe what the Deutsch-Jorza problem is all about, let's recall the 4 functions that classic computers can perform on a single bit that statisfies $f: Σ \rightarrow Σ $ on our classical state set $Σ=\\{0, 1\\}$ :

$$
\begin{array}{c|c}
s & f_1(s) \\\
\hline
0 & 0 \\\
1 & 0 \\\
\end{array}
\hspace{3mm}
\begin{array}{c|c}
s & f_2(s) \\\
\hline
0 & 0 \\\
1 & 1 \\\
\end{array}
\hspace{3mm}
\begin{array}{c|c}
s & f_3(s) \\\
\hline
0 & 1 \\\
1 & 0 \\\
\end{array}
\hspace{3mm}
\begin{array}{c|c}
s & f_4(s) \\\
\hline
0 & 1 \\\
1 & 1 \\\
\end{array}
$$

1. $f_1(s)$: **Set 0** always return a constant state $0$ regardless if its input
2. $f_2(s)$: **identity** return the same state as an output that was their input
3. $f_3(s)$: **inverter** also known as NOT function, return an output state that is the opposite of their input state
4. $f_4(s)$: **Set 0** always return a constsnt state $1$ regardless if its input

These 4 functions can be divided into two different categories. On the one hand we have **constant** functions $f_1(s)$ and $f_4(s)$ that always return only one of the two states and on the other hand we have **balanced** functions $f_2(s)$ and $f_3(s)$ that return both states to the same ration depending on its input.

The Deutsch-Jorza problem assumes that we have a blackbox which contains one of those 4 functions, but we don't know which one it is. We can send bits into the blackbox and observe the output we get. The task to solve is to find out whether the function in the blackbox is **constant** or **balanced**.

On a classic computer we always need two querys to determine for sure whether the function is constant or balanced. If we send in a $0$ and we receive back a $0$ as an output, then our function could be either the **set 0** function $f_1(s)$ which is constant, or the **identity** function $f_2(s)$ which is balanced. If we send a $0$ into the blackbox and get back a $1$ it could be either  the **set 1** function $f_4(s)$ or the **negation** function $f_3(s)$. What this means is that we always have to send two bits one after the other into the blackbox in two queries to find out the exact function it contains. Without knowing exactly which function is in the black box we dont have enough information to determine determine the category. This will change when we use a quantum computer, wich can solve the problem with a single query, without needing to know the exact function the black box contains. 

But before we start sending bits into the black box, we have to look at a few more things. First we have to clarify how exactly these 4 functions inside the black box run on a quantum computer, because we run into an obstacle with the constant functions. If we discussed in the last part, quantum operations must always be reversible, and the constant functions **set 1** and **set 0** obviously are not. This is a common problem that we encounter when we work with quantum computers. The solution to this problem is that we rewrite the function in such a way that it is reversible again. We can achieve this by using a second bit to store our output while we leave the initial input bit untouched.

At this point we have to take a look at how we work with multiple qubit systems so far we have only considered systems that consist of a single bit. Mathematically we can represent the quantum state of a multiple bit system with the tensor product of the individual bits with the following schema:  
$$
|ψ\rangle=|q_1​\rangle⊗|q_2​\rangle⊗ \dots |q_n\rangle
$$

{{< aside label="Tensor Product" >}}
The tensor product of two vector spaces captures the properties of all bilinear maps in the sense that a bilinear map from $V \times W$ into another vector space $Z$ factors uniquely through a linear map $V ⊗ W → Z$. The tensor product is calculated as follows:
$$
V ⊗ W =
\begin{bmatrix}
    x_1 \\\
    x_2
\end{bmatrix} ⊗
\begin{bmatrix}
    y_1 \\\
    y_2
\end{bmatrix} =
\begin{bmatrix}
    x_1 \times& \hspace{-5mm} \begin{bmatrix}
            y_1 \\\
            y_2
          \end{bmatrix} \\\
    x_2 \times& \hspace{-5mm} \begin{bmatrix}
            y_1 \\\
            y_2
          \end{bmatrix}
\end{bmatrix} =
\begin{bmatrix}
    x_1\times y_1 \\\
    x_1\times y_2 \\\
    x_2\times y_1 \\\
    x_2\times y_2 
\end{bmatrix}
$$
{{< /aside >}}

So let's take a look at some two two-qubit system examples and calculate their states. When we take the base states $|0\rangle$ and $|1​\rangle$ we can construct 4 unique states, if we dont take superposition into account. The 4 states would look like this:
$$
|0\rangle ⊗ |0\rangle =
\begin{bmatrix}
    1 \\\
    0
\end{bmatrix} ⊗
\begin{bmatrix}
    1 \\\
    0
\end{bmatrix} =
\begin{bmatrix}
    1 \\\
    0 \\\
    0 \\\
    0
\end{bmatrix} =
|00\rangle
$$
$$
|0\rangle ⊗ |1\rangle =
\begin{bmatrix}
    1 \\\
    0
\end{bmatrix} ⊗
\begin{bmatrix}
    0 \\\
    1
\end{bmatrix} =
\begin{bmatrix}
    0 \\\
    1 \\\
    0 \\\
    0
\end{bmatrix} =
|01\rangle
$$
$$
|1\rangle ⊗ |0\rangle =
\begin{bmatrix}
    0 \\\
    1
\end{bmatrix} ⊗
\begin{bmatrix}
    1 \\\
    0
\end{bmatrix} =
\begin{bmatrix}
    0 \\\
    0 \\\
    1 \\\
    0
\end{bmatrix} =
|10\rangle
$$
$$
|1\rangle ⊗ |1\rangle =
\begin{bmatrix}
    0 \\\
    1
\end{bmatrix} ⊗
\begin{bmatrix}
    0 \\\
    1
\end{bmatrix} =
\begin{bmatrix}
    0 \\\
    0 \\\
    0 \\\
    1
\end{bmatrix} =
|11\rangle
$$

At this point we also look at a new quantum operation that is based on multiple qubit systems, the controlled not gate, also reffered to as the CNOT gate.

## The Controlled-NOT Gate
The cnot gate is a quantum logic gate that operates on a pair of qubits, where one qubit is considered the control bit and the other qubit is the target bit. The Cnot gate flips the state of the target bit based on the control bit. If the control bit is 1, the target bit is flipped, similar to the XOR logic gate that classical computers use. The matrix multiplication with the unitary matrix that represents the CNOT gate would look like this for our two-qubit example states:
$$
\renewcommand{\arraystretch}{2.0}
C \times |01\rangle =
\begin{bmatrix}
    1 & 0 & 0 & 0\\\
    0 & 1 & 0 & 0\\\
    0 & 0 & 0 & 1\\\
    0 & 0 & 1 & 0
\end{bmatrix}
\times
\begin{bmatrix}
    0 \\\
    1 \\\
    0 \\\
    0 \\\
\end{bmatrix} =
\begin{bmatrix}
    0 \\\
    1 \\\
    0 \\\
    0 \\\
\end{bmatrix} =
|01\rangle
$$
$$
\renewcommand{\arraystretch}{2.0}
C \times |10\rangle =
\begin{bmatrix}
    1 & 0 & 0 & 0\\\
    0 & 1 & 0 & 0\\\
    0 & 0 & 0 & 1\\\
    0 & 0 & 1 & 0
\end{bmatrix}
\times
\begin{bmatrix}
    0 \\\
    0 \\\
    1 \\\
    0 \\\
\end{bmatrix} =
\begin{bmatrix}
    0 \\\
    0 \\\
    0 \\\
    1 \\\
\end{bmatrix} =
|11\rangle
$$
The first qubit of our state $|01\rangle$ is $0$ so the C gate leaves the second qubit untouched, basically doing nothing to our state. The first qubit of the second state $|10\rangle$ is $1$ so the C gate indeed flipps the second qubit resulting in the state $|11\rangle$. The c not gate is also very important for our Deutsch-Jorza problem as we will see soon and from this point on we know basically everything we need to know to solve the problem on a quantum computer. For the sake of clarity, we will also take a look at a type of visualization called quantum circuit we can use to display our quantum computing model. 

## The Quantum Circuit Model
The quantum cirquit model is used to display qiantum computations as a sequence of quantum logic gates, messurements and any other form of operation. A quantum circuit is read from left to right, where the qubits are portrait as a straight line on which various operations are placed one after the other. The following example shows a quantum circuit consisting of two qubits $q[0]$ and $q[1]$ where an Hadamart gate gets applied on qubit $q[0]$ and followed with a CNOT gate where the $q[0]$ qubit is the control bit and $q[1]$ the target bit.


{{< dynamicimage image="/posts/img/NS-QuantumComputingFundamentals/quantum-cirquit-entanglement" optClass="quantumCircuit" format="png" alt="test" >}}

This is a simple but really powerful quantum circuit, what it does we will introduce in another part of this series, but this represents another big phenomenon in quantum mechanics, thats what we can reveal so far. To get back to our Deutsch-Jorza problem, let's look at how we can implement the 4 functions inside the black box as a quantum circuit. for our qantum cirquit we use a two-bit system consisting of a qubit *q[1]*, which is our input qubit, and an additional spare qubit *q[2]*, that we initialize with the state 0 an to where we write the output of our function. In this case our qubit q1 remains untouched and our function execution inside the black box is reversible.

{{< dynamicimage image="/posts/img/NS-QuantumComputingFundamentals/quantum-cirquit-blackbox" optClass="quantumCircuitBig" format="png" alt="test" >}}

In the black box our 4 functions would look like this:
1. **Constant-0:** Since the qubit *q[2]* will store the output of the function and we initially send the qubit with the state 0 into the black box, the black box simply remains empty to mirror the function

{{< dynamicimage image="/posts/img/NS-QuantumComputingFundamentals/quantum-cirquit-constant0" optClass="quantumCircuitBig" format="png" alt="test" >}}

2. **Constant: 1** This function looks very similar, besides flipping the qubit *q[2]* from 0 to 1 using the *NOT* gate, represented as *X* in a quantum cierquit.

{{< dynamicimage image="/posts/img/NS-QuantumComputingFundamentals/quantum-cirquit-constant1" optClass="quantumCircuitBig" format="png" alt="test" >}}

3. **Identity** The identity function we can mirror with a single CNOT gate where our input qubit *q[1]* is the control bit and our qubit *q[2]* is the target bit. If *q[1]* is send in with the state 1, it also flips qubit *q[2]* to 1 as well. If *q[1]* is send it with the state 0, the qubit *q[2]* remains in state 0 as we sent it into the black box.
   
{{< dynamicimage image="/posts/img/NS-QuantumComputingFundamentals/quantum-cirquit-identity" optClass="quantumCircuitBig" format="png" alt="test" >}}

4. **Negation** The negation function can be mirrored with a CNOT gate like the identity function, but followed with a bitflip for our output qubit *q[2]* using a NOT gate.
   
{{< dynamicimage image="/posts/img/NS-QuantumComputingFundamentals/quantum-cirquit-negation" optClass="quantumCircuitBig" format="png" alt="test" >}}

## The Deutsch-Jorza Algorithm

Finally, we have everything we need to solve the German jorza problem on a quantum computer, and that faster than a classic computer as we will hopefully prove shortly. The quantum circuit used to solve the problem looks like this:

{{< dynamicimage image="/posts/img/NS-QuantumComputingFundamentals/quantum-cirquit-deutsch-jorza" optClass="quantumCircuitBig" format="png" alt="test" >}}
First, we initialize *q[2]* with the state 0 and send it on its way together with our arbitrary input bit. First we perform a bitflip on both qubits with the NOT gate (X) and then we put both qubits into an equal superposition using the Hadamard gate before sending the qubits through the blackbox. Inside the black box one of the 4 circuits discussed for our 4 functions is applied to our two qubits. 

and then we bring both bits back into a stable state after the black box before we measure them.

4 funktions as quantum operations


how long does classical computers need

how long does quantum computer need

