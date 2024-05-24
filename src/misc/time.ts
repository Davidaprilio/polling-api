/**
 * Time value representation of duration in milliseconds
 */
export enum Time {
    Milisecond = 1,
    Second = 1000,
    Minute = Time.Second * 60,
    Hour = Time.Minute * 60,
    Day = Time.Hour * 24,
    Week = Time.Day * 7,
    Month = Time.Day * 30,
    Year = Time.Day * 365
} 

export const SECOND = 1