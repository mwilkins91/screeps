const mySpawns = Object.values(Game.spawns).filter(spawn => spawn.my); //Array of my spawns
const creeps = Object.values(Game.creeps).filter(creep => creep.my);
const creepTemplates = {
	worker: [WORK, CARRY, MOVE]
};
const workers = Object.values(Game.creeps).filter(creep => {
	const test = new RegExp('worker', 'gi');
	return creep.my && test.test(creep.name);
});

function canCreateCreep(spawn, creepToCreate) {
	const num = Object.keys(creeps);
	const result = spawn.spawnCreep(creepToCreate, `Worker-${num.length + 1}`, {
		dryRun: true
	});
	return result;
}

function createCreep(spawn, creepToCreate) {
	const num = Object.keys(creeps);
	const result = spawn.spawnCreep(creepToCreate, `Worker-${num.length + 1}`, {
		dryRun: false
	});
	return result;
}

function getTarget(whereWeAre, max) {
	let current = whereWeAre;
	while (current > max) {
		current = current - max;
	}
	return current;
}

mySpawns.forEach(spawn => {
	if (canCreateCreep(spawn, creepTemplates.worker) === 0) {
		createCreep(spawn, creepTemplates.worker);
	}
});

workers.forEach((creep, i) => {
	const energySources = creep.room.find(FIND_SOURCES);

	if (energySources.length > 0) {
		const target = energySources[getTarget(i, energySources.length - 1)];
		console.log(target);
		creep.moveTo(target);
	}
});
