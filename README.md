SourceUndead :: Server
============

Multi-player [in progress] zombie game built with Postgres, Express, Redis, ReactJS and NodeJS

I left out my settings.js file because it has private credentials in it. But here is the schema I used (a simple JS Object) to have my settings all in one file:

    export default: {
        PGHOST: string;
        PGPORT: number;
        PGUSER: string;
        PGPASSWORD: string;
        PGDATABASE: string;
    }

Special Thanks
==============

[@rlemon](https://github.com/rlemon) -- Helping design, teach, and create the express node routing system. Also screamed BABEL at me several times.

[@ssube](https://github.com/ssube) -- Designed the algorithm to determine player bearing within radius of sense, along with teaching me redis, and why I should use it.

[@ralt](https://github.com/ralt) -- For yelling at my shit code so that I wrote good code. U da real MVP.