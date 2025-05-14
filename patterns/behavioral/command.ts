function main() {
	console.log("Please read the code below, start with example\n");

	abstractExample();

	console.log("Then continue with concrete example");

	concreteExample();
}

function abstractExample() {
	/**
	 * The Command interface declares a method for executing a command.
	 */
	interface Command {
		execute(): void;
	}

	/**
	 * Some commands can implement simple operations on their own.
	 */
	class SimpleCommand implements Command {
		private payload: string;

		constructor(payload: string) {
			this.payload = payload;
		}

		public execute(): void {
			console.log(
				`SimpleCommand: See, I can do simple things like printing (${this.payload})`,
			);
		}
	}

	/**
	 * However, some commands can delegate more complex operations to other objects,
	 * called "receivers."
	 */
	class ComplexCommand implements Command {
		private receiver: Receiver;

		/**
		 * Context data, required for launching the receiver's methods.
		 */
		private a: string;

		private b: string;

		/**
		 * Complex commands can accept one or several receiver objects along with
		 * any context data via the constructor.
		 */
		constructor(receiver: Receiver, a: string, b: string) {
			this.receiver = receiver;
			this.a = a;
			this.b = b;
		}

		/**
		 * Commands can delegate to any methods of a receiver.
		 */
		public execute(): void {
			console.log(
				"ComplexCommand: Complex stuff should be done by a receiver object.",
			);
			this.receiver.doSomething(this.a);
			this.receiver.doSomethingElse(this.b);
		}
	}

	/**
	 * The Receiver classes contain some important business logic. They know how to
	 * perform all kinds of operations, associated with carrying out a request. In
	 * fact, any class may serve as a Receiver.
	 */
	class Receiver {
		public doSomething(a: string): void {
			console.log(`Receiver: Working on (${a}.)`);
		}

		public doSomethingElse(b: string): void {
			console.log(`Receiver: Also working on (${b}.)`);
		}
	}

	/**
	 * The Invoker is associated with one or several commands. It sends a request to
	 * the command.
	 */
	class Invoker {
		private onStart: Command;

		private onFinish: Command;

		/**
		 * Initialize commands.
		 */
		public setOnStart(command: Command): void {
			this.onStart = command;
		}

		public setOnFinish(command: Command): void {
			this.onFinish = command;
		}

		/**
		 * The Invoker does not depend on concrete command or receiver classes. The
		 * Invoker passes a request to a receiver indirectly, by executing a
		 * command.
		 */
		public doSomethingImportant(): void {
			console.log("Invoker: Does anybody want something done before I begin?");
			if (this.isCommand(this.onStart)) {
				this.onStart.execute();
			}

			console.log("Invoker: ...doing something really important...");

			console.log("Invoker: Does anybody want something done after I finish?");
			if (this.isCommand(this.onFinish)) {
				this.onFinish.execute();
			}
		}

		private isCommand(object): object is Command {
			return object.execute !== undefined;
		}
	}

	/**
	 * The client code can parameterize an invoker with any commands.
	 */
	const invoker = new Invoker();
	invoker.setOnStart(new SimpleCommand("Say Hi!"));
	const receiver = new Receiver();
	invoker.setOnFinish(
		new ComplexCommand(receiver, "Send email", "Save report"),
	);

	invoker.doSomethingImportant();
}

function concreteExample() {
	class OrderManager {
		private orders: { id: string }[] = [];

		execute(command: Command, ...args: any[]) {
			return command.execute(this.orders, ...args);
		}
	}

	abstract class Command {
		abstract execute(orders: { id: string }[], ...args: any[]): void;
	}

	class PlaceOrderCommand extends Command {
		constructor(
			private order: string,
			private id: string,
		) {
			super();
		}

		execute(orders: { id: string }[]) {
			orders.push({ id: this.id });
			console.log(`You have successfully ordered ${this.order} (${this.id})`);
		}
	}

	class CancelOrderCommand extends Command {
		constructor(private id: string) {
			super();
		}

		execute(orders: { id: string }[]) {
			orders = orders.filter((order) => order.id !== this.id);
			console.log(`You have canceled your order ${this.id}`);
		}
	}

	class TrackOrderCommand extends Command {
		constructor(private id: string) {
			super();
		}

		execute() {
			console.log(`Your order ${this.id} will arrive in 20 minutes.`);
		}
	}

	const manager = new OrderManager();

	manager.execute(new PlaceOrderCommand("Pad Thai", "1234"));
	manager.execute(new TrackOrderCommand("1234"));
	manager.execute(new CancelOrderCommand("1234"));
}
main();
