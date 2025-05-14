function main() {
	console.log("Please read the code below, start with strategy example\n");

	abstractExample();

	console.log("Then continue with concrete strategy example");

	concreteExample();
}

function abstractExample() {
	/**
	 * The Context defines the interface of interest to clients.
	 */
	class Context {
		/**
		 * @type {Strategy} The Context maintains a reference to one of the Strategy
		 * objects. The Context does not know the concrete class of a strategy. It
		 * should work with all strategies via the Strategy interface.
		 */
		private strategy: Strategy;

		/**
		 * Usually, the Context accepts a strategy through the constructor, but also
		 * provides a setter to change it at runtime.
		 */
		constructor(strategy: Strategy) {
			this.strategy = strategy;
		}

		/**
		 * Usually, the Context allows replacing a Strategy object at runtime.
		 */
		public setStrategy(strategy: Strategy) {
			this.strategy = strategy;
		}

		/**
		 * The Context delegates some work to the Strategy object instead of
		 * implementing multiple versions of the algorithm on its own.
		 */
		public doSomeBusinessLogic(): void {
			// ...

			console.log(
				"Context: Sorting data using the strategy (not sure how it'll do it)",
			);
			const result = this.strategy.doAlgorithm(["a", "b", "c", "d", "e"]);
			console.log(result.join(","));

			// ...
		}
	}

	/**
	 * The Strategy interface declares operations common to all supported versions
	 * of some algorithm.
	 *
	 * The Context uses this interface to call the algorithm defined by Concrete
	 * Strategies.
	 */
	interface Strategy {
		doAlgorithm(data: string[]): string[];
	}

	/**
	 * Concrete Strategies implement the algorithm while following the base Strategy
	 * interface. The interface makes them interchangeable in the Context.
	 */
	class ConcreteStrategyA implements Strategy {
		public doAlgorithm(data: string[]): string[] {
			return data.sort();
		}
	}

	class ConcreteStrategyB implements Strategy {
		public doAlgorithm(data: string[]): string[] {
			return data.reverse();
		}
	}

	/**
	 * The client code picks a concrete strategy and passes it to the context. The
	 * client should be aware of the differences between strategies in order to make
	 * the right choice.
	 */
	const context = new Context(new ConcreteStrategyA());
	console.log("Client: Strategy is set to normal sorting.");
	context.doSomeBusinessLogic();

	console.log("");

	console.log("Client: Strategy is set to reverse sorting.");
	context.setStrategy(new ConcreteStrategyB());
	context.doSomeBusinessLogic();
}

function concreteExample() {
	// Step 1: define a Strategy interface
	interface PaymentStrategy {
		pay(amount: number): void;
	}

	// Step 2: implement concrete strategies
	class CreditCardStrategy implements PaymentStrategy {
		public pay(amount: number): void {
			console.log(`Paid ${amount} using credit card.`);
		}
	}

	class PayPalStrategy implements PaymentStrategy {
		public pay(amount: number): void {
			console.log(`Paid ${amount} using PayPal.`);
		}
	}

	// Step 3: define a Context class
	class Item {
		private price: number;
		private paymentStrategy: PaymentStrategy;

		constructor(price: number, paymentStrategy: PaymentStrategy) {
			this.price = price;
			this.paymentStrategy = paymentStrategy;
		}

		public buy(): void {
			this.paymentStrategy.pay(this.price);
		}
	}

	// Step 4: use the Strategy pattern in the client code
	const item = new Item(100, new CreditCardStrategy());
	item.buy();

	console.log("");

	const item2 = new Item(200, new PayPalStrategy());
	item2.buy();
}
main();
