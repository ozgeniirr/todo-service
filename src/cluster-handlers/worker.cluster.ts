import App from '../App'
import { BaseClusterHandler } from './base.cluster'

export class WorkerClusterHandler extends BaseClusterHandler {
	public async handle(): Promise<void> {
		await App.loadServer()
	}
}
