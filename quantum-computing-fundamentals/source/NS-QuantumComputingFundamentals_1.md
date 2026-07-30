---
series: "Quantum Computing Fundamentals"
title: "Part 1: Introduction to Quantum Mechanics and the Bedrock of Quantum based Computation"
type: article
date: 2023-11-30
image: "/posts/img/NS-QuantumComputingFundamentals/title-image7.jpg"
draft: false
tags: ["Quantum Computing", "Quantum Mechanics", "Entanglement", "Cloud", "Infrastructure"]
authors:
 - Niklas Schuster
summary: "This blog article is the start of a series to introduces the fundamentals of quantum computation to create a broad understanding of how contum computers actually work and how they are different to classical computers. It includes a brief introduction to quantum mechanics and linear algebra in order to show exactly where the difference is between classical arithmetic operations and quantum-based arithmetic operations."
---
# Unveiling the Quantum World
In the world of modern physics, few realms spark as much astonishment as quantum mechanics as it completely rewrotes the laws shaping the behavior of matter at the atomic and subatomic levels and revolutionized our understanding of the fundamental building blocks of our universe. In contrast to the deterministic nature of classical physics, where an objects behavior is very rigidly defined and predictable, quantum mechanics introduces a never seen before level of uncertainty and instead of immutable states, we are suddenly dealing with merely probabilities that defy conventional logic. New principles in quantum mechanics like superposition and entanglement might challenge our intuition and perception, but also open up a new paradigm of possibilities with great significance especially in computing. 

To delve into the quantum computing realm, it's essential to grasp the fundamentals of quantum mechanics and its distinction from classical computation. So let's back up a bit for this first part of this series and let's take a look at how classical computation models actually work from a theoretical perspective illuminated through the lens of linear algebra.

## Unraveling the Essence Through Linear Algebra

Let's imagine a generic encapsuated system that can processes and store information in a finite number of immutable states. Such a system could be, for example, a six-sided die, that can store information in 6 different immutable states $\mathbf{1}$,$\mathbf{2}$,$\mathbf{3}$,$\mathbf{4}$,$\mathbf{5}$ and $\mathbf{6}$ one for each of its sides. Another example would be the bits of our classical computers which are using different voltages to depict a binary system storing information in two immutable states $\mathbf{0}$ and $\mathbf{1}$.
If we assign our system the name $S$ and the symbol $Σ$ to refer to the set of immutable states of $S$, than we could define both systems as follows:

- If $S$ is a bit, then $Σ=\\{0, 1\\}$
- If $S$ is a six-sided die, then $Σ=\\{1, 2, 3, 4, 5, 6\\}$


Sometimes when dealing with our system $S$ transitioning between states we know the precise current state of $S$. However, while processing information, uncertainty often prevails regarding the state of $S$. In such situations, we can describe the current state by a combination of each of its individual states with an assigned probability, resulting in something called a probabilistic state. For example, if we consider $X$ being a Bit that equals to the state 1 in one out of three cases, then we can describe its current state with a probability of $33.\overline{3}\\%$ being in state $\mathbf{1}$ and $66.\overline{6}\\%$ being in state $\mathbf{0}$. We can express this by formulating two probability functions describing the probabilities of the state $\mathbf{0}$ and $\mathbf{1}$ like the following:

$$
P(x=0) = \frac{2}{3}
$$
$$
P(x = 1) = \frac{1}{3}
$$

$$
We can also express this more consisely by using a probability vector where the top element represents the probability of $X$ being in our state $\mathbf{0}$ and the bottom element the probability of $X$ being in our state $\mathbf{1}$.

$$
\renewcommand{\arraystretch}{2.0}
p =
\begin{bmatrix}
    \frac{2}{3} \\\ 
    \frac{1}{3}
\end{bmatrix} 
\begin{matrix}
    \longleftarrow \text{probability of being in the state}\hspace{3mm} 0 \\\
    \longleftarrow \text{probability of being in the state}\hspace{3mm} 1
\end{matrix}
$$

Generally, with this schema we can describe a probalistic state of any classical systems with a finite number of classical states, be it a six-sided die or a Bit, as follows as long as it statisfy two conditions:

$$ p = \begin{bmatrix} p_1 \\\ p_2 \\\ \vdots \\\ p_i \end{bmatrix} $$


1. $ \sum_{i=1}^{n} p_i = 1 $ meaning the elements of the vector must sum up to 1, representing the entire probability space
2. $ p_i \in \mathbb{R}_{\geq 0}$ meaning all elements of the vector must be non-negative real numbers

As long as we dont know the exact state of a system at a given moment, we must describe it probabilistically based on the information we have. However, we can easily alter this uncertainty simply by observing our system and measuring its state. If we read out the system and measure its state always to be $\mathbf{1}$, then this corresponds to a probability vector with a 100% probability of the state being $\mathbf{1}$ and a 0% probability of it being $\mathbf{0}$, and vice versa. According to this scheme, we get the following two vectors:

$$
\renewcommand{\arraystretch}{2.0}
P(0) =
\begin{bmatrix}
    1 \\\
    0
\end{bmatrix} $$ $$
\renewcommand{\arraystretch}{2.0}
P(1) =
\begin{bmatrix}
    0 \\\
    1
\end{bmatrix} 
$$

These two vectors directly reflect our fixed stages $\mathbf{1}$ and $\mathbf{0}$ and therefore have a special meaning. They are also referred to as standard basis vectors and are often expressed in a different notation, the Dirac notation (also known as Bra-Ket notation). Where a so called *"ket"*  $|1\rangle$ corresponds to the vector for our state $\mathbf{1}$ and a *"ket"*  $|0\rangle$ corresponds to the vector for our state $\mathbf{0}$ like the following:

$$
\renewcommand{\arraystretch}{2.0}
|0\rangle =
\begin{bmatrix}
    1 \\\
    0
\end{bmatrix} 
$$
$$
\renewcommand{\arraystretch}{2.0}
|1\rangle =
\begin{bmatrix}
    0 \\\
    1
\end{bmatrix} 
$$

Therefore it can be concluded that any probalistic state is a linear combination of the standart basis vectors of each of its finite states. For our *"one out of three times"* bit example this means:

$$
p = \frac{2}{3} |0\rangle + \frac{1}{3} |1\rangle = \frac{2}{3} 
\begin{bmatrix}
    0 \\\
    1
\end{bmatrix} +
\frac{1}{3}
\begin{bmatrix}
    0 \\\
    1
\end{bmatrix} =
\renewcommand{\arraystretch}{2.0}
\begin{bmatrix}
    \frac{2}{3} \\\ 
    \frac{1}{3}
\end{bmatrix} 
$$


Up to this point we have learnt how a classical system like a bit can store information in a finite number of states and what a mathematical description of a state or probabilistic state looks like. In the next step we look at how a system can actually process information. 


## Unveiling the Mathematical Symphony of State Operations
Processing information actually means to transition between states by performing mathematical operations on our state vectors. For every state $s$ in our set of finite states $Σ$ ($s \in Σ$) we can transition to another state $f(s)$ as long as the functions statisfies the schema $f: Σ \rightarrow Σ $. 

For our classic bit this would result in exactly 4 functions for transitioning from one state to another:

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

If we examine these functions closely, we see that functions $f_1(s)$ and $f_4(s)$ each just return a constant state regardless of their input. Based on these tables, we can derive the following behaviors for these four functions:

1. $f_1(s)$: Is a **constant function** that always return a constant state $\mathbf{0}$, regardless of whether its input state was $\mathbf{0}$ or $\mathbf{1}$. 
2. $f_2(s)$: Is the **identity function** that return the same state as an output that was their input
3. $f_3(s)$: Is the **inverter function** also known as NOT-function that return an output state that is the opposite of their input state
4. $f_4(s)$: Is a **constant function** that always return a constant state $\mathbf{1}$, regardless of whether its input state was $\mathbf{0}$ or $\mathbf{1}$.

For Transitioning from one of our state vectors to another, we have to do matrix multiplication, which means each operation corresponds to a multiplication of our state vector with a corresponding matrix. Our mentioned 4 functions would than mathematically translate to these 4 matrices, wherees each matrix $M$ is unique for every $s∈Σ$

$$
f_1(s): \hspace{2mm} M_1 =
\begin{bmatrix}
    1 & 1 \\\
    0 & 0
\end{bmatrix}
$$
$$
f_2(s): \hspace{2mm} M_2 =
\begin{bmatrix}
    1 & 0 \\\
    0 & 1
\end{bmatrix}
$$
$$
f_3(s): \hspace{2mm} M_3 =
\begin{bmatrix}
    0 & 1 \\\
    1 & 0
\end{bmatrix}
$$
$$
f_4(s): \hspace{2mm} M_4 =
\begin{bmatrix}
    0 & 0 \\\
    1 & 1
\end{bmatrix}
$$



So let's take the state $|0\rangle$ and apply the matrix $M_3$ corresponding to our inverter function $f_3(s)$ and do some multiplication:
$$
M_3 \times |0\rangle = 
\begin{bmatrix}
    0 & 1 \\\
    1 & 0
\end{bmatrix} \times
\begin{bmatrix}
    1 \\\
    0
\end{bmatrix} =
\begin{bmatrix}
    (0×1+1×0) \\\
    (1×1+0×0)
\end{bmatrix} =
\begin{bmatrix}
    0 \\\
    1
\end{bmatrix} =
|1\rangle
$$



If we think of a classic computer, then these are all the operations that a computer consisting of a single bit can perform. In practice, of course, we have systems with a multi bit architecture, which opens up room for further binary operations that require multiple input bits. These are reffered to as logical gates, and consist of the following gates: **NOT**, **AND**, **NAND**, **OR**, **NOR**, **XOR** and **XNOR**. These logical gates are the fundamental building blocks of more complex circuits that define every type of processing a classical computer can do . In other words, these gates define what operations a classical computer is capable of doing.


# Bridging the Chasm
As already mentioned earlier, on a physical layer classical computers use different voltages to represent bits with two fixed states $\mathbf{0}$ and $\mathbf{1}$ and are therefore subject to the classical deterministic physics, but what about quantum computers?

Quantum computers use properties of subatomic particles which are subject to the laws of quantum mechanics. Since the behavior of bits under quantum effects differs from classic bits, we are refering to these bits as quantum bits, or short, qubits. 

{{< aside label="Note" >}}
On a physical level, there are several ways to make quantum effects availabel for computation, wich result in different types of qubits, like Superconducting Qubits, Trapped Ion Qubits, Quantum Dot Qubits or Photonic Qubits just to name a few. However, this is not much relevant at this point, as they all have similar key characteristics. 
{{< /aside >}}

Some Qubits for example, use the spin of an electron to image qubits. The Spin is an intrinsic form of angular momentum of elementary particles, for an electron this can be either up or down wich correspnds to the values $\mathbf{\frac{1}{2}}$ or $-\mathbf{\frac{1}{2}}$.The spin-up and spin-down states are usually also written in Dirac notation $∣↑⟩$ and $∣↓⟩$ as it represented by two state vectors. At first glance this means that we can yet again depict two fixed basis states like classical bits, but what exactly is the difference than?

The difference is that an electron as already mentioned, is subject to quantum effects and is therefore also affected by fundamental quantum principles like superposition or entaglement. Where a Superposition is one of the central principles in quantum mechanics, and one that is not easy to wrap your head around. 

The problem we have when describing quantum effects like superposition is the limitation of our language. We have a language problem, so to speak, because our language and all analogies we might have to describe things are based on our perception of reality and the classical deterministic physics we all experience in daily life. The only language that can correctly describe quantum mechanical processes is mathematics. Therefore, it is difficult to describe or explain quantum mechanics in words. Nonetheless, we'll try anyway.


If we think of a classic bit it is always in one of the two classical states, either $0$ or $1$. If we dont know its current state we can measure it to observe it to gain the knowlwdge of which state it is in, but even if we don't measure it and dont know in wich state the bit is in, we know for sure it must be in one of the two classical states $0$ or $1$. Qubits are different because qubits can be in a so-called superposition, which means a qubit can be in a state of two overlapping states. We can meassure Qubits just as classical bits, resulting in the same behavior returning us one of the two states $0$ and $1$, but if we dont actively observe and measure it, it can actually exist in both states simultaneously. That means, in contrast to classical bits, we cannot assume that the qubit is in one of the two states, but rather it is often in both states at the same time. States that are affected by quantum affects are reffered to as quantum states.

This concept sounds really strange, because it is from our human intuition and perception of reality, but yet this principle has produced so much experimental evidence that we cannot deny that this is actually how reality works on a subatomic scale. If you're having a hard time imagining what this actually means you are not alone, here are some quoates what some of the best scientists of our time had to say about it:

{{< quote author="Richard Feynman" src="" srcLabel="">}}
I think I can safely say that nobody really understands quantum mechanics
{{< /quote >}}
{{< quote author="Niels Bohr" src="" srcLabel="">}}
If quantum mechanics hasn't profoundly shocked you, you haven't understood it yet.
{{< /quote >}}

Or as Erwin Schrödinger used to say with his poetic words:

{{< quote author="Erwin Schrödinger" src="" srcLabel="">}}
I don't like it, and I'm sorry I ever had anything to do with it.
{{< /quote >}}


Since the whole thing is is hard to grasp through our language, let's go back to the best way we have to describe it, mathematics. So lets see what that means for vectors that represents a state. Yet again a quantum state is represented by a collumn vector just like probability states with classical systems. The crucial difference lies in the conditions that restrict a valid quantum state. As a quick reminder, probalistic states of our classical computation model must meet the following conditions:

1. $ \sum_{i=1}^{n} p_i = 1 $ meaning the elements of the vector must sum up to 1, representing the entire probability space
2. $ p_i \in \mathbb{R}_{\geq 0}$ meaning all elements of the vector must be non-negative real numbers

If we consider the following definition of a generic quantum state $|ψ\rangle$, the conditions that a quantum state has to statisfy would look like this:
$$ |ψ\rangle = \begin{bmatrix} p_1 \\\ \vdots \\\ p_i \end{bmatrix} $$
1. $ \langle ψ|ψ\rangle $ meaning the probabilities of all possible outcomes must sum up to 1
2. $ p_i \in \mathbb{C}$ meaning all elements of a quantum state vector must be complex numbers

In other words, in opposition to probalistic states where the sum of the entries must be equal to 1, for quantum states all absolute values squared must sum up to 1. Furthermore, things get a little complex here, in the truest sense of the word, because all elements of a quantum state are not non-negative real numbers like with probablistic states, instead they are all complex numbers.

These two rather small changes are the only fundamental difference between quantum states and classical states, but these lead to major aftermath. If you look at the conditions for classical states and quantum states, it can be noticed that the conditions for classical states also apply to those for quantum states. This means that classical states and quantum states are not necessarily two opposing things, but quantum states are rather more of an extension to classical states. To put it more simply a classical state on principal can be understood as an edge case quantum state, but a quantum state is not necessarily a classical state. From this simple relation you can already guess why computation based on quantum states is much more powerful than computation with our classical states alone.

Furthermore, this relationship also imply that quantum systems also have a set of classical states. So let's assume a qubit that also has the classical state set $Σ=\\{0, 1\\}$. Then we can again formulate our two standard basis vectors and a simple check should confirm that these are in fact valid quantum states:

$$
\renewcommand{\arraystretch}{2.0}
|0\rangle =
\begin{bmatrix}
    1 \\\
    0
\end{bmatrix}
\quad \quad \quad
|0\rangle : \quad |1|^2+|0|^2=1
$$
$$
\renewcommand{\arraystretch}{2.0}
|1\rangle =
\begin{bmatrix}
    0 \\\
    1
\end{bmatrix}
\quad \quad \quad
|1\rangle : \quad |0|^2+|1|^2=1
$$

The sum of all absolute values squared is indeed equal to $1$ for both our standart basis vectors $|0\rangle$ and $|1\rangle$ and they are also complex numbers, although here the imaginary part of the numbers is just zero. Then let's look again at an example where we have a quantum state that does not correspond to an identical classical state, like the following example that represents a quantum state of an equal superposition between the classical states $0$ and $1$:

$$
\renewcommand{\arraystretch}{2.0}
\frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle =
\begin{bmatrix}
    \frac{1}{\sqrt{2}} \\\
    \frac{1}{\sqrt{2}}
\end{bmatrix} :
\quad
\left| \frac{1}{\sqrt{2}} \right|^2 + \left| \frac{1}{\sqrt{2}} \right|^2 = \frac{1}{2} + \frac{1}{2} = 1
$$

So let's take this quantum state, which is in an equal superposition of $0$ and $1$, and look at what happens when we measure it. Similar to measuring probabilistic state, when we performe measurement on a quantum state, we force the superposition to collaps and show us one of its two classical states as we can only observe fixed states and not pure probabilities. If observing a quantum state shows us one of its classical states based on probabilities, just like a probability vector does in classical systems, then what exactly is the essential difference?

The difference is that due to the fact that a quantum state can be in a superposition being in both states at the same time, the possible operations that can be performed on a quantum state differ from those that can be carried out on pure classical states


This leads to a number of new operations that we can perform that are exclusive to quantum states and therefore have a big advantage over classic systems. In other words, quantum computers have an expanded toolset of operations that can be performed. Everything that a classical computer can do can also be done on a quantum computer, as long as we woul restrict our quantum computer to only use states that represent our classical state set, but a quantum computer can do a lot more.

## Quantum Gates
### Hadamard Gate
Operations on quantum systems are also represented by multiplication with matrices identically to classical systems, but with a small restriction. The first operation we will look at is reffered to as the Hadamard gate ($H$), but before we waste too many words on it, let's just let the language of mathematics speak for us and see what happens when we apply the Hadamart gate to one of our two statdard states.

$$
\renewcommand{\arraystretch}{2.0}
H \times |0\rangle =
\begin{bmatrix}
    \frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\\
    \frac{1}{\sqrt{2}} & \frac{-1}{\sqrt{2}}
\end{bmatrix}
\times
\begin{bmatrix}
    1 \\\
    0
\end{bmatrix} =
\begin{bmatrix}
    \frac{1}{\sqrt{2}} \\\
    \frac{1}{\sqrt{2}}
\end{bmatrix}
$$
$$
\renewcommand{\arraystretch}{2.0}
H \times |1\rangle =
\begin{bmatrix}
    \frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\\
    \frac{1}{\sqrt{2}} & \frac{-1}{\sqrt{2}}
\end{bmatrix}
\times
\begin{bmatrix}
    0 \\\
    1
\end{bmatrix} =
\begin{bmatrix}
    \frac{1}{\sqrt{2}} \\\
    \frac{-1}{\sqrt{2}}
\end{bmatrix}
$$


The resulting quantum states should look very familiar, as we have already introduced one of them as the example above. Knowing this we can also deduce what the $H$ gate actually does, namely it takes a classical input bit and puts it into an equal superposition of both of its classical base states, with a 50% probability for the superposition to collaps to $0$ and a 50% probability for our superposition to collaps to $1$. We can easily check this if we take the square of its absolute values to calculate the probability for each of its standart basis vectors:
$$
\begin{bmatrix}
    \frac{1}{\sqrt{2}} \\\
    \frac{1}{\sqrt{2}}
\end{bmatrix}: \quad
\renewcommand{\arraystretch}{2.0}
P(|0\rangle) =
\left| \frac{1}{\sqrt{2}} \right|^2 = \frac{1}{2}
\quad \quad
\renewcommand{\arraystretch}{2.0}
P(|1\rangle) =
\left| \frac{1}{\sqrt{2}} \right|^2 = \frac{1}{2}
$$
$$
\begin{bmatrix}
    \frac{1}{\sqrt{2}} \\\
    \frac{-1}{\sqrt{2}}
\end{bmatrix}: \quad
\renewcommand{\arraystretch}{2.0}
P(|0\rangle) =
\left| \frac{1}{\sqrt{2}} \right|^2 = \frac{1}{2}
\quad \quad
\renewcommand{\arraystretch}{2.0}
P(|1\rangle) =
\left| \frac{-1}{\sqrt{2}} \right|^2 = \frac{1}{2}
$$

Since both of these states represent exact equable superpositions, these quantum states also have a special meaning and are usually represented with *"ket +"* and *"ket -"* :
$$
\renewcommand{\arraystretch}{2.0}
H|0\rangle =
\begin{bmatrix}
    \frac{1}{\sqrt{2}} \\\
    \frac{1}{\sqrt{2}}
\end{bmatrix} = |+\rangle
$$
$$
\renewcommand{\arraystretch}{2.0}
H|1\rangle =
\begin{bmatrix}
    \frac{1}{\sqrt{2}} \\\
    \frac{-1}{\sqrt{2}}
\end{bmatrix} = |-\rangle
$$

One thing that is immediately noticeable is that we have exactly one negative number in the matrix representation of the $H$ gate. On the one hand, this shows that with quantum operations we are no longer limited to non-negative real numbers as with classical operations, instead we are indeed in the realm of complex numbers, and on the other hand, there is also a specific reason for this we will discuss later. The |-\rangle state is also characterized by a negative number ofits element. Although both states $|+\rangle$ and $|-\rangle$ represent a uniform superposition, they are not particiluarly identical. This becomes especially clear when we look at the geometry behind it. Since quantum states are a linear combination of its basis vectors with complex numbers, the representation of a qubit is portrayed using a 3D spatial model. 

While classical bits are represented in a two-dimensional space (0 and 1), qubits are represented in a higher-dimensional complex vector space using spherical coordinates. Wich means if we visualize our qubit, then we end up with a sphere with a radius of 1, where our two classical base states form its two poles, this model is also reffered to as the Bloch sphere. Our two operations on the base states using the Hadamard gate would look like this:

{{< gallery >}}
{{< dynamicimage image="/posts/img/NS-QuantumComputingFundamentals/bloch-sphere-0" format="png" optClass="blochSphereSmall" alt="test" >}}
$
\begin{align}
    & H|0\rangle = |+\rangle  \\\
    & \hspace{10mm} \longrightarrow \\\
    \\\
    \\\
\end{align}
\quad
$
{{< dynamicimage image="/posts/img/NS-QuantumComputingFundamentals/bloch-sphere-h0" format="png" optClass="blochSphereSmall" alt="test" >}}
{{< /gallery >}}

---

{{< gallery >}}
{{< dynamicimage image="/posts/img/NS-QuantumComputingFundamentals/bloch-sphere-1" format="png" optClass="blochSphereSmall" alt="test" >}}
$
\begin{align}
    & H|1\rangle = |-\rangle  \\\
    & \hspace{10mm} \longrightarrow \\\
    \\\
    \\\
\end{align}
\quad
$
{{< dynamicimage image="/posts/img/NS-QuantumComputingFundamentals/bloch-sphere-h1" format="png" optClass="blochSphereSmall" alt="test" >}}
{{< /gallery >}}







At this point we come back to the negative entry in our Hadamard gate matrix. What's the significance ofthis becomes visible when we can take the output quantum state from our previous operation on our $|0\rangle$ state and use it as an input for another operation to chain another $H$ gate to it. Then we get the following:

$$
\renewcommand{\arraystretch}{2.0}
H|0\rangle =
\begin{bmatrix}
    \frac{1}{\sqrt{2}} \\\
    \frac{1}{\sqrt{2}}
\end{bmatrix} \longrightarrow
H
\begin{bmatrix}
    \frac{1}{\sqrt{2}} \\\
    \frac{1}{\sqrt{2}}
\end{bmatrix} =
\begin{bmatrix}
    \frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\\
    \frac{1}{\sqrt{2}} & \frac{-1}{\sqrt{2}}
\end{bmatrix}
\times
\begin{bmatrix}
    \frac{1}{\sqrt{2}} \\\
    \frac{1}{\sqrt{2}}
\end{bmatrix} =
\begin{bmatrix}
    1 \\\
    0
\end{bmatrix} = |0\rangle
$$
If we apply the $H$ gate twice to our state $|0\rangle$, then we end up back where we started at $|0\rangle$ and that is no coincidence. At the beginning we mentioned that quantum operations are just like deterministic operations with a small restriction and that restriction is that quantum operations always have to be 100% reversible. That being said, we'll draw a line for this part and move on in the next part of our quantum computing fundamentels blog series.

{{< aside label="Note" >}}
On a mathematical level there is also a proof that quantum operations must always be reversible because of the fact that they are unitary matrices, statisfying the conditions following below. For the sake of simplicity, we will skip this for now.  $$UU^†=I,\quad U^†U​= I.$$ 
{{< /aside >}}


## Conclusion
Based on the groundwork we learned about how qubits and quantum-based systems work on a fundamental level and how they differ from classical systems like our current classical computers, we can already dispel a famous myth myth about quantum computers; Quantum computers are not simply faster computers, but rather open up completely new toolset of operations that can be performed on quantum states like the Hadamard gate we just disscussed. 

The question that is still left untouched at this point is what this advanced toolset actually means in practice and how we can we use it to perform calculations that are actually superior to what classic computers are able to do. Therefore, in the second part of the series we will primarily focus at the Deutch-Jorza problem, one of the simplest scenarios where quantum computers outperform classical computers.

