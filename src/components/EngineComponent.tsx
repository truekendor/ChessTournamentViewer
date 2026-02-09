import type { CCCEngine, CCCLiveInfo } from "../types";

import "./EngineComponent.css"
import { EngineLogo } from "./EngineLogo";

type EngineComponentProps = {
    info: CCCLiveInfo
    engine: CCCEngine
    time: number
}

function formatLargeNumber(value: string) {
    const x = Number(value)
    if (x >= 1_000_000_000)
        return String(Math.floor(100 * x / 1_000_000_000) / 100).padEnd(2, "0") + "B"
    if (x >= 1_000_000)
        return String(Math.floor(100 * x / 1_000_000) / 100).padEnd(2, "0") + "M"
    if (x >= 1_000)
        return String(Math.floor(100 * x / 1_000) / 100).padEnd(2, "0") + "K"
    return String(value)
}

function formatTime(time: number) {
    if (time < 0)
        time = 0;

    const hundreds = String(Math.floor(time / 10) % 100).padStart(2, "0");
    const seconds = String(Math.floor(time / 1000) % 60).padStart(2, "0");
    const minutes = String(Math.floor(time / (1000 * 60)) % 60).padStart(2, "0");
    return `${minutes}:${seconds}.${hundreds}`
}

export function EngineComponent({ engine, info, time }: EngineComponentProps) {
    return (
        <div className="engine">
            <EngineLogo engine={engine} />
            <span className="engineName">{engine.name}</span>
            <span className="engineEval">{info.info.score}</span>
            <span className="engineField">Depth <span>{info.info.depth} / {info.info.seldepth}</span></span>
            <span className="engineField">Nodes: {formatLargeNumber(info.info.nodes)}</span>
            <span className="engineField">NPS: {formatLargeNumber(info.info.speed)}</span>
            <span className="engineField">Time: {formatTime(time)}</span>
        </div>
    )
}