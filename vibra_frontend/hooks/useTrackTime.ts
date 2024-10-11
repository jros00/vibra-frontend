import { useEffect, useState } from "react";
import { Song } from "@/types/Song";
import { ListeningTime } from "@/types/ListeningTime";
import { sendListeningTimes } from "@/services/ForYouApi";

export const useTrackTime =(isPlaying: boolean, currentSong: Song | null) => {

    const [listeningTimes, setListeningTimes] = useState<Array<ListeningTime>>([]);
    const [startTime, setStartTime] = useState<string | Date>(new Date());
    const [prevSong, setPrevSong] = useState<Song | null>(null);

    // Helper function to convert Date to ISO string, or return string if already a string
    const convertToISOString = (date: string | Date): string => {
        return date instanceof Date ? date.toISOString() : date;
    };

    // Make new ListeningTime instance
    const appendListeningTime = async (localEndTime: Date, prevSong: Song) => {
        try {
            const newListeningTime: ListeningTime = {
            track_id: prevSong.track_id,
            start_listening_time: convertToISOString(startTime),
            end_listening_time: convertToISOString(localEndTime),
            };
            setListeningTimes((prevTimes) => [...prevTimes, newListeningTime]);
        } catch (error) {
            console.error("Error appending listening time:", error);
        }
    };

    // Tracking play and pause
    useEffect(() => {
        if (isPlaying && currentSong) {
            setStartTime(new Date());
        } else if (currentSong) {
            const localPrevSong = currentSong!;
            const localEndTime = new Date();
            appendListeningTime(localEndTime, localPrevSong);
        }
    }, [isPlaying]);

    // Tracking when changing song
    useEffect(() => {
        if (currentSong && prevSong && currentSong !== prevSong) {
            const localEndTime = new Date();
            appendListeningTime(localEndTime, prevSong); // Log the previous song listening time
        }

        // Update prevSong to the new current song
        if (currentSong) {
            setPrevSong(currentSong);
            setStartTime(new Date()); // Start tracking time for the new song
        }
    }, [currentSong])
  

    // Sending listen histories in chunks
    useEffect(() => {
        console.log('listeningtime', listeningTimes);
        if (listeningTimes.length >= 5) {
            sendListeningTimes(listeningTimes);
            setListeningTimes([]);
        }
    }, [listeningTimes]);
};