
export abstract class BaseClusterHandler {
	protected cpuCount: number

	constructor() {
		this.cpuCount = require('os').cpus().length
		console.log(`Server :: CPU Count: ${this.cpuCount}`)
	}

	abstract handle(): void

	async startProcess(): Promise<void> {
		await this.handle()
	}
}
